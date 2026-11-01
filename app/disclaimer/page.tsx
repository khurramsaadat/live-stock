import type { Metadata } from "next";
import { LegalLayout } from "@/components/market/legal-layout";

export const metadata: Metadata = {
  title: "Disclaimer - LiveStocks",
  description: "Important disclaimers about market data accuracy and financial decisions when using LiveStocks.",
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="November 1, 2026">
      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">1. General Disclaimer</h2>
        <p>
          The information provided by LiveStocks is for general informational and educational purposes only. All
          information on the application is provided in good faith; however, we make no representation or warranty of
          any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or
          completeness of any information displayed.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">2. Not Financial Advice</h2>
        <p>
          LiveStocks is not a registered broker-dealer, investment advisor, or financial planner. Nothing on this
          application constitutes professional financial advice, solicitation, recommendation, endorsement, or offer to
          buy or sell any securities or other financial instruments.
        </p>
        <p className="mt-3 rounded-lg border border-[#FF5000]/30 bg-[#FF5000]/5 p-4 text-[0.9rem]">
          <strong className="text-[#FF5000]">Important:</strong> Any investment decisions you make should be based on
          your own research and consultation with a licensed financial professional. Past performance is not indicative
          of future results. All investments carry risk, including the potential loss of principal.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">3. Market Data Disclaimer</h2>
        <p>Stock prices and market data displayed in the application:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>May be delayed by 15 minutes or more depending on the data provider</li>
          <li>May not reflect the actual current market price at any given moment</li>
          <li>Are sourced from third-party APIs (Finnhub, Twelve Data) and may contain errors</li>
          <li>Should not be used as the sole basis for any trading or investment decision</li>
          <li>Are provided for informational purposes and may not match data from official exchanges</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">4. Third-Party Content</h2>
        <p>
          LiveStocks may display company logos, names, and ticker symbols that are trademarks of their respective
          owners. The display of such content does not imply endorsement by or affiliation with those companies.
          Stock logos are sourced from publicly available resources and are used solely for identification purposes.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">5. No Guarantee of Availability</h2>
        <p>
          The service relies on third-party market data APIs that have rate limits and usage restrictions. Data
          availability may be interrupted at any time without notice. Weekend and holiday data reflects the last
          available trading session. Pre-market and after-hours data may not be available depending on the data
          provider.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">6. Risk Acknowledgment</h2>
        <p>
          By using LiveStocks, you acknowledge that:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Stock market investing involves substantial risk of loss</li>
          <li>You are solely responsible for your own investment decisions</li>
          <li>The app does not guarantee the accuracy of any displayed information</li>
          <li>Historical data and charts may not accurately predict future performance</li>
          <li>You will not hold LiveStocks or its creators liable for any losses</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">7. Simulated Data</h2>
        <p>
          When markets are closed or during periods where live data is unavailable, the application may display
          simulated or interpolated data for demonstration purposes. Such data is clearly generated and does not
          represent actual market movements. Do not use simulated data for any financial planning or decision-making.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">8. Limitation of Liability</h2>
        <p>
          Under no circumstances shall LiveStocks, its developers, or affiliates be held liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to business interruption) arising
          out of the use or inability to use the application, even if we have been notified of the possibility of such
          damages.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold text-ink">9. Contact</h2>
        <p>
          If you have questions about this disclaimer, reach out through the contact details provided in the
          application footer.
        </p>
      </section>
    </LegalLayout>
  );
}
