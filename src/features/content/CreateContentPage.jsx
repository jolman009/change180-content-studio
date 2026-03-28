import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Card from "../../components/ui/Card";
import ContentForm from "../../components/content/ContentForm";
import GeneratedOutput from "../../components/content/GeneratedOutput";
import {
  createContentDraftInput,
  createContentPost,
  getDraftInputFromContentPost,
  getGeneratedContentFromContentPost,
  getAvailableContentTypes,
  getPlatformDefaults,
  normalizeGeneratedContent,
  validateContentDraftInput,
  validateGeneratedContent,
} from "../../lib/contentDraft";
import { getBrandProfile } from "../../services/brandService";
import { generateContent, rewriteGeneratedContent } from "../../services/aiService";
import { getContentPostById, saveContentPost, updateContentPost } from "../../services/contentService";
import { publishPost } from "../../services/publishService";
import { uploadMedia } from "../../services/mediaService";

export default function CreateContentPage() {
  const { draftId } = useParams();
  const [form, setForm] = useState(createContentDraftInput);
  const [loading, setLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [activeRewriteAction, setActiveRewriteAction] = useState("");
  const [output, setOutput] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [outputErrors, setOutputErrors] = useState({});
  const [generateError, setGenerateError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [brandProfile, setBrandProfile] = useState(null);
  const [draftLoadError, setDraftLoadError] = useState("");
  const [draftLoading, setDraftLoading] = useState(Boolean(draftId));
  const [currentDraftId, setCurrentDraftId] = useState(draftId ?? "");
  const [publishStatus, setPublishStatus] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [postStatus, setPostStatus] = useState("draft");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadBrandContext() {
      try {
        const result = await getBrandProfile();
        if (isMounted) {
          setBrandProfile(result.data);
        }
      } catch {
        if (isMounted) {
          setBrandProfile(null);
        }
      }
    }

    loadBrandContext();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDraft() {
      if (!draftId) {
        setCurrentDraftId("");
        setDraftLoading(false);
        setDraftLoadError("");
        return;
      }

      setDraftLoading(true);
      setDraftLoadError("");

      try {
        const result = await getContentPostById(draftId);

        if (!isMounted) {
          return;
        }

        setCurrentDraftId(result.data.id ?? draftId);
        setForm(getDraftInputFromContentPost(result.data));
        const loadedOutput = getGeneratedContentFromContentPost(result.data);
        setOutput(loadedOutput);
        if (loadedOutput.mediaUrl) {
          setMediaUrl(loadedOutput.mediaUrl);
          setMediaType(loadedOutput.mediaType);
          setMediaPreviewUrl(loadedOutput.mediaUrl);
        }
        setPostStatus(result.data.status || "draft");
        setPublishStatus({
          postId: result.data.id ?? draftId,
          publishedAt: result.data.publishedAt,
          platformPostId: result.data.platformPostId,
          publishError: result.data.publishError,
        });
        toast.info("Loaded saved draft into the editor.");
      } catch (error) {
        if (isMounted) {
          setDraftLoadError(error.message || "Unable to load the selected draft.");
        }
      } finally {
        if (isMounted) {
          setDraftLoading(false);
        }
      }
    }

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, [draftId]);

  function onChange(e) {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "platform") {
        const platformDefaults = getPlatformDefaults(value);
        const availableContentTypes = getAvailableContentTypes(value);
        const nextContentType = availableContentTypes.includes(prev.contentType)
          ? prev.contentType
          : availableContentTypes[0];

        return {
          ...prev,
          platform: value,
          contentType: nextContentType,
          goal: platformDefaults.goal,
          tone: platformDefaults.tone,
        };
      }

      return { ...prev, [name]: value };
    });

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setGenerateError("");
  }

  function onOutputChange(e) {
    const { name, value } = e.target;

    setOutput((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [name]:
          name === "hashtags"
            ? value
                .split(/\s+/)
                .map((item) => item.trim())
                .filter(Boolean)
            : value,
      };
    });

    setOutputErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleMediaSelect(file) {
    setIsUploadingMedia(true);
    try {
      const result = await uploadMedia(file);
      setMediaUrl(result.url);
      setMediaType(result.type);
      setMediaPreviewUrl(result.url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingMedia(false);
    }
  }

  function handleMediaRemove() {
    setMediaUrl(null);
    setMediaType(null);
    setMediaPreviewUrl(null);
  }

  async function onGenerate() {
    const nextErrors = validateContentDraftInput(form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setGenerateError("Fill the required planning fields before generating content.");
      setOutput(null);
      return;
    }

    setLoading(true);
    setGenerateError("");
    setFieldErrors({});
    setOutputErrors({});

    try {
      const generated = await generateContent(form, brandProfile);
      const normalizedOutput = normalizeGeneratedContent(generated);
      // Preserve media attachment across regeneration
      if (mediaUrl) {
        normalizedOutput.mediaUrl = mediaUrl;
        normalizedOutput.mediaType = mediaType;
      }
      setOutput(normalizedOutput);
      toast.success("Draft generated with current brand context.");
    } catch (err) {
      setOutput(null);
      setGenerateError(err.message || "Unable to generate content.");
    } finally {
      setLoading(false);
    }
  }

  async function onRewrite(actionId) {
    if (!output) {
      toast.error("Generate content before using rewrite actions.");
      return;
    }

    setIsRewriting(true);
    setActiveRewriteAction(actionId);
    setGenerateError("");

    try {
      const rewritten = await rewriteGeneratedContent(form, output, actionId, brandProfile);
      setOutput(normalizeGeneratedContent(rewritten));
      toast.success(`Applied the ${actionId.replace("_", " ")} rewrite action.`);
    } catch (err) {
      toast.error(err.message || "Unable to rewrite the generated content.");
    } finally {
      setIsRewriting(false);
      setActiveRewriteAction("");
    }
  }

  async function handlePublish(postId, platform) {
    setIsPublishing(true);

    try {
      const result = await publishPost(postId, platform);
      setPostStatus("posted");
      setPublishStatus({
        postId,
        platformPostId: result.data.platformPostId,
        publishedAt: result.data.publishedAt,
        publishError: null,
      });
      toast.success(`Published to ${platform}.`);
    } catch (err) {
      setPublishStatus((prev) => ({
        ...prev,
        publishError: err.message || "Publish failed",
      }));
      toast.error(err.message || "Publish failed.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function onSaveDraft() {
    if (!output) {
      toast.error("Generate content before saving a draft.");
      return;
    }

    const nextFormErrors = validateContentDraftInput(form);
    const nextOutputErrors = validateGeneratedContent(output);

    if (Object.keys(nextFormErrors).length > 0 || Object.keys(nextOutputErrors).length > 0) {
      setFieldErrors(nextFormErrors);
      setOutputErrors(nextOutputErrors);
      toast.error("Fix the missing draft fields before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const draft = createContentPost(form, output);
      // Attach media to draft
      draft.mediaUrl = mediaUrl;
      draft.mediaType = mediaType;
      const result = currentDraftId
        ? await updateContentPost(currentDraftId, draft)
        : await saveContentPost(draft);

      if (!currentDraftId && result.data?.id) {
        setCurrentDraftId(result.data.id);
      }

      if (result.source === "supabase") {
        toast.success(currentDraftId ? "Draft updates saved." : "Draft saved.");
      } else {
        toast.info(
          currentDraftId
            ? "Draft updates saved in local mock storage."
            : "Draft saved in local mock storage."
        );
      }
    } catch (err) {
      toast.error(err.message || "Unable to save the draft.");
    } finally {
      setIsSaving(false);
    }
  }

  if (draftLoading) {
    return (
      <Card title="Loading Draft" subtitle="Pulling the saved content into the editor.">
        <p className="text-sm text-gray-500">Please wait while the draft is loaded.</p>
      </Card>
    );
  }

  if (draftLoadError) {
    return (
      <Card title="Draft Not Available" subtitle="The saved draft could not be loaded.">
        <p className="text-sm text-red-600">{draftLoadError}</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
      <Card
        title={currentDraftId ? "Edit Draft" : "Create Content"}
        subtitle={
          currentDraftId
            ? "Review the saved draft, update the copy, and save changes."
            : "Turn a coaching idea into a usable social asset"
        }
      >
        <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm text-gray-600 sm:px-4">
          <p className="sm:hidden">
            Start with one clear topic. Generate first, then use rewrite actions to tighten the
            draft.
          </p>
          <p className="hidden sm:block">
            Start with one clear topic, pick the platform where it should live, then use rewrite
            actions after generation instead of overstuffing the initial prompt.
          </p>
        </div>
        <ContentForm
          form={form}
          fieldErrors={fieldErrors}
          onChange={onChange}
          onGenerate={onGenerate}
          onMediaSelect={handleMediaSelect}
          onMediaRemove={handleMediaRemove}
          mediaPreviewUrl={mediaPreviewUrl}
          isUploadingMedia={isUploadingMedia}
          loading={loading}
          error={generateError}
        />
      </Card>

      <GeneratedOutput
        output={output}
        loading={loading}
        error={generateError}
        isRewriting={isRewriting}
        activeRewriteAction={activeRewriteAction}
        fieldErrors={outputErrors}
        isSaving={isSaving}
        platform={form.platform}
        contentType={form.contentType}
        onChange={onOutputChange}
        onRetryGenerate={onGenerate}
        onRewrite={onRewrite}
        onSaveDraft={onSaveDraft}
        saveLabel={currentDraftId ? "Save Draft Changes" : "Save Draft"}
        publishStatus={currentDraftId ? publishStatus : null}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        postStatus={postStatus}
      />
    </div>
  );
}
