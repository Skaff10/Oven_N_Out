"use server";

export interface TelegramOrderNotificationPayload {
  id: string;
  source?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: { name: string; qty: number; unitPrice: number; variant?: string }[];
  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  paymentMethod?: string;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendOrderTelegramNotification(
  order: TelegramOrderNotificationPayload
): Promise<void> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing from environment variables.");
      return;
    }

    const itemsFormatted = order.items
      .map(
        (item) =>
          `• <b>${escapeHtml(item.name)}</b>${item.variant ? ` (${escapeHtml(item.variant)})` : ""} x${item.qty} — ৳${item.unitPrice * item.qty}`
      )
      .join("\n");

    const message =
      `🛍️ <b>NEW ORDER RECEIVED!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `<b>Order ID:</b> <code>${escapeHtml(order.id)}</code>\n` +
      `<b>Source:</b> ${escapeHtml((order.source || "website").toUpperCase())}\n\n` +
      `👤 <b>Customer:</b> ${escapeHtml(order.customerName)}\n` +
      `📞 <b>Phone:</b> ${escapeHtml(order.customerPhone)}\n` +
      `📍 <b>Address:</b> ${escapeHtml(order.customerAddress || "N/A")}\n\n` +
      `📦 <b>Items:</b>\n${itemsFormatted}\n\n` +
      (order.subtotal !== undefined ? `<b>Subtotal:</b> ৳${order.subtotal}\n` : "") +
      (order.deliveryFee !== undefined ? `<b>Delivery Fee:</b> ৳${order.deliveryFee}\n` : "") +
      `💰 <b>Total Amount:</b> <b>৳${order.totalAmount}</b> (${escapeHtml((order.paymentMethod || "COD").toUpperCase())})\n` +
      `⏰ <b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Telegram API Error]:", response.status, errorText);
    }
  } catch (error: any) {
    console.error("[Telegram Notification Error]:", error?.message || error);
  }
}
