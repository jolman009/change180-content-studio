export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mb-6 text-sm text-gray-500">Effective date: March 16, 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Overview</h2>
          <p>
            Change180 Content Studio ("the App") is a content management tool operated by
            Change180 Life Coaching ("we", "us", "our"). This policy explains what data the
            App collects, how it is used, and your rights regarding that data.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Data We Collect</h2>
          <p className="mb-3">When you connect a social media account, we collect and store:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Your platform display name and user/page ID</li>
            <li>An access token that allows the App to publish posts on your behalf</li>
            <li>For Facebook: the name and ID of the Facebook Page you manage</li>
            <li>For Instagram: your Instagram Business Account username and ID (if linked to your Facebook Page)</li>
            <li>For LinkedIn: your profile name and member ID</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">How We Use Your Data</h2>
          <p className="mb-3">Your data is used exclusively to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Display your connected account status within the App</li>
            <li>Publish content you have authored and approved to your connected social media accounts</li>
            <li>Generate AI-powered content suggestions based on your brand profile</li>
          </ul>
          <p className="mt-3">
            We do not sell, share, or distribute your data to any third parties. Your access
            tokens are stored securely in our database and are never exposed to the client
            application.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Third-Party Services</h2>
          <p className="mb-3">The App integrates with the following third-party services:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Supabase</strong> — authentication and data storage</li>
            <li><strong>OpenAI</strong> — AI content generation (brand profile data is sent to generate content; no access tokens are shared)</li>
            <li><strong>Meta (Facebook/Instagram)</strong> — social media publishing via the Graph API</li>
            <li><strong>LinkedIn</strong> — social media publishing via the LinkedIn API</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Data Retention</h2>
          <p>
            Your connected account credentials are stored for as long as your account remains
            connected. When you disconnect a platform, the associated access token and platform
            data are immediately deleted from our database.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Your Rights</h2>
          <p className="mb-3">You can at any time:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Disconnect any social media account from the App, which deletes stored credentials</li>
            <li>Revoke the App's access directly from your Facebook, Instagram, or LinkedIn account settings</li>
            <li>Request deletion of all your data by contacting us</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Contact</h2>
          <p>
            For questions or concerns about this privacy policy, contact us
            at <a href="https://www.change180.org" className="text-sky-600 hover:underline">change180.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
