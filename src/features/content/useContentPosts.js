import { useCallback, useEffect, useState } from "react";
import { getContentPosts, updateContentPost } from "../../services/contentService";

export function useContentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingPostId, setSavingPostId] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getContentPosts();
      setPosts(result.data);
    } catch (err) {
      setError(err.message || "Unable to load content posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const savePostUpdates = useCallback(async (postId, updates) => {
    setSavingPostId(postId);
    setError("");

    try {
      const result = await updateContentPost(postId, updates);

      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.id === postId ? result.data : post)),
      );
    } catch (err) {
      setError(err.message || "Unable to update the content post.");
    } finally {
      setSavingPostId("");
    }
  }, []);

  return {
    posts,
    loading,
    error,
    savingPostId,
    reloadPosts: loadPosts,
    savePostUpdates,
  };
}
