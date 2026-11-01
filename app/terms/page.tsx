import type { Metadata } from "next";
import { LegalLayout } from "@/components/market/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service - LiveStocks",
  description: "Terms and conditions governing your use of the LiveStocks platform.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="November 1, 2026">
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">1. Acceptance of Terms</h2>
        <p>
          By accessing or using LiveStocks (&quot;the app&quot;, &quot;the service&quot;), you agree to be bound by these Terms of
          Service. If you do not agree to these terms, do not use the service. These terms apply to all visitors and
          users of the application.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">2. Description of Service</h2>
        <p>
          LiveStocks is a free, open-source stock market dashboard that displays real-time and delayed equity quotes,
          market indices, heatmaps, and charts. The service is provided for educational and informational purposes only.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">3. No Financial Advice</h2>
        <p>
          LiveStocks does not provide financial advice, investment recommendations, or trading signals. The data
          displayed is sourced from third-party providers and may be delayed, inaccurate, or incomplete. You should not
          rely on this service for making investment decisions. Always consult a qualified financial advisor before
          making any investment.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">4. No Trading Functionality</h2>
        <p>
          LiveStocks is a read-only dashboard. You cannot buy, sell, or trade securities through this application. We
          do not hold, manage, or have access to any financial accounts, brokerage accounts, or funds.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">5. Market Data Accuracy</h2>
        <p>
          Market data is provided &quot;as is&quot; from third-party APIs including Finnhub and Twelve Data. We make no
          guarantees about the accuracy, completeness, timeliness, or reliability of any data displayed. Data may be
          delayed by 15 minutes or more depending on the provider and market conditions. Prices shown may not reflect
          the actual trading prices at the time of your viewing.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">6. User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Use automated tools to scrape or extract data at high volume from the application</li>
          <li>Attempt to circumvent API rate limits or abuse third-party data provider services</li>
          <li>Use the service for any unlawful purpose or in violation of any applicable laws</li>
          <li>Redistribute market data obtained through the service in violation of data provider agreements</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">7. Intellectual Property</h2>
        <p>
          Company logos displayed in the application are the property of their respective owners and are used for
          identification purposes only. The LiveStocks application code, design, and branding are the property of
          Khurram and are protected by applicable intellectual property laws.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, LiveStocks and its creator shall not be liable for any direct,
          indirect, incidental, special, consequential, or punitive damages arising from your use of the service. This
          includes, but is not limited to, financial losses resulting from reliance on data displayed by the
          application.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">9. Service Availability</h2>
        <p>
          We do not guarantee that the service will be available at all times. The application may experience downtime
          for maintenance, updates, or due to factors beyond our control. Market data availability depends on
          third-party providers and may be interrupted during API outages, rate limiting, or provider maintenance
          windows.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">10. Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be reflected in the &quot;Last updated&quot; date
          on this page. Your continued use of the service after modifications constitutes acceptance of the updated
          terms.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">11. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict
          of law provisions.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">12. Contact</h2>
        <p>
          For questions about these terms, contact us through the information provided in the application footer.
        </p>
      </section>
    </LegalLayout>
  );
}
