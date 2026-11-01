import type { Metadata } from "next";
import { LegalLayout } from "@/components/market/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy - LiveStocks",
  description: "How LiveStocks handles your data, what we collect, and your privacy rights.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="November 1, 2026">
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">1. Overview</h2>
        <p>
          LiveStocks (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is a real-time stock market dashboard built for educational
          and informational purposes. We are committed to protecting your privacy. This policy explains what data we
          collect, how we use it, and the choices you have.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">2. Data We Collect</h2>
        <p>We keep data collection to a minimum:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong className="text-ink">Local Storage Data:</strong> Your watchlist, theme preference, and cached
            market data are stored locally in your browser using <code>localStorage</code>. This data never leaves your
            device.
          </li>
          <li>
            <strong className="text-ink">Market API Requests:</strong> When the app fetches stock quotes, your browser
            makes requests to third-party market data providers (Finnhub, Twelve Data). These providers may log IP
            addresses per their own privacy policies.
          </li>
          <li>
            <strong className="text-ink">No Accounts or Personal Information:</strong> LiveStocks does not require user
            accounts, emails, passwords, or any personally identifiable information to use.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">3. Cookies and Tracking</h2>
        <p>
          LiveStocks does not use cookies, analytics trackers, advertising pixels, or any form of cross-site tracking.
          We do not use Google Analytics, Facebook Pixel, or similar services.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">4. Third-Party Services</h2>
        <p>The app relies on the following third-party services for market data:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong className="text-ink">Finnhub:</strong> Provides real-time and delayed stock quotes. Their privacy
            policy is available at{" "}
            <a href="https://finnhub.io/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:opacity-80">
              finnhub.io
            </a>.
          </li>
          <li>
            <strong className="text-ink">Twelve Data:</strong> Provides supplementary market data. Their privacy policy
            is available at{" "}
            <a href="https://twelvedata.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:opacity-80">
              twelvedata.com
            </a>.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">5. Data Storage and Security</h2>
        <p>
          All user preferences and cached data are stored exclusively in your browser&apos;s <code>localStorage</code>.
          No data is transmitted to our servers. No database stores your information. If you clear your browser data,
          your watchlist and preferences will reset to defaults.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">6. Your Rights</h2>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong className="text-ink">Access:</strong> All your data is visible locally in your browser&apos;s
            developer tools under Application &gt; Local Storage.
          </li>
          <li>
            <strong className="text-ink">Deletion:</strong> Clear your browser&apos;s local storage or click &quot;Reset&quot; in the
            watchlist to remove all stored data.
          </li>
          <li>
            <strong className="text-ink">Portability:</strong> Your watchlist is a simple JSON array stored in
            localStorage that you can copy at any time.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">7. Children&apos;s Privacy</h2>
        <p>
          LiveStocks is not directed at children under 13 and does not knowingly collect personal information from
          minors.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">8. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be reflected in the &quot;Last updated&quot; date at
          the top of this page. Continued use of the app after changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">9. Contact</h2>
        <p>
          If you have questions about this privacy policy, you can reach out via the contact information provided in the
          footer of the application.
        </p>
      </section>
    </LegalLayout>
  );
}
