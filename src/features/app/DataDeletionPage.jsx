export default function DataDeletionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Data Deletion Instructions</h1>
      <p className="mb-6 text-sm text-gray-500">
        Change180 Content Studio ("the App") allows you to connect your Facebook and Instagram
        accounts for publishing content. If you want to delete your data, follow the steps below.
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Option 1: Disconnect from within the App
          </h2>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Sign in to Change180 Content Studio.</li>
            <li>Navigate to <strong>Connected Accounts</strong> from the sidebar.</li>
            <li>Click <strong>Disconnect</strong> next to Facebook and/or Instagram.</li>
            <li>Your access token, page ID, and platform username are immediately deleted from our database.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Option 2: Remove from Facebook settings
          </h2>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Go to your <a href="https://www.facebook.com/settings?tab=business_tools" className="text-sky-600 hover:underline">Facebook Settings &gt; Business Integrations</a>.</li>
            <li>Find <strong>Change180 Content Studio</strong> and click <strong>Remove</strong>.</li>
            <li>This revokes the App's access to your Facebook and Instagram accounts.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Option 3: Request deletion by email
          </h2>
          <p>
            If you are unable to access the App or Facebook settings, you can request complete
            deletion of your data by contacting us at{" "}
            <a href="https://www.change180.org" className="text-sky-600 hover:underline">change180.org</a>.
            Please include the email address associated with your account. We will process your
            request and confirm deletion within 30 days.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">What data is deleted</h2>
          <p className="mb-3">When you disconnect or request deletion, we remove:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Facebook Page access token</li>
            <li>Facebook Page ID and name</li>
            <li>Instagram Business Account ID and username (if connected)</li>
            <li>Connection timestamps</li>
          </ul>
          <p className="mt-3">
            Content posts you created within the App are retained under your user account unless
            you specifically request their deletion. Posts already published to Facebook or
            Instagram are managed by those platforms and must be deleted there directly.
          </p>
        </section>
      </div>
    </div>
  );
}
