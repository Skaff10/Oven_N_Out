import { getOrder } from "@/lib/orders";
import OrderTrackingClient from "./OrderTrackingClient";
import type { Order } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ new?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Track Order #${resolvedParams.orderId.substring(0, 8)}... | Oven & Out`,
    description: "Track your real-time cloud kitchen order from Oven & Out.",
  };
}

export default async function OrderStatusPage({ params, searchParams }: PageProps) {
  // Await parameters for Next.js App Router compatibility
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const orderId = resolvedParams.orderId;
  const isNew = resolvedSearchParams?.new === "true";

  const order = await getOrder(orderId);

  return (
    <OrderTrackingClient
      initialOrder={order as Order | null}
      orderId={orderId}
      isNewOrder={isNew}
    />
  );
}
