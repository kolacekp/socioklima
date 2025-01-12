import type { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { registerOTel } from '@vercel/otel';

export async function register() {
  let traceExporter: SpanExporter | undefined;

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { AzureMonitorTraceExporter } = await import('@azure/monitor-opentelemetry-exporter');
    traceExporter = new AzureMonitorTraceExporter({
      connectionString: process.env.APP_INSIGHTS_CONNECTION_STRING
    });
  }

  registerOTel({ serviceName: process.env.OTEL_SERVICE_NAME, traceExporter });
}
