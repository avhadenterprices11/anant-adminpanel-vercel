/**
 * Abandoned Carts Data Mapper
 *
 * Maps backend API responses to frontend UI types
 */

import type { AbandonedCartApiItem } from "./abandonedCartsApi.types";
import type {
  AbandonedOrder,
  AbandonedOrderProduct,
  RecoveryStatus,
} from "../types/abandonedOrder.types";

/**
 * Map backend abandoned cart API item to frontend AbandonedOrder type
 */
export function mapApiToAbandonedOrder(
  apiCart: AbandonedCartApiItem,
): AbandonedOrder {
  return {
    id: apiCart.id,
    cartId: `CART-${apiCart.id.slice(0, 8).toUpperCase()}`,
    customerName: apiCart.customer_name || "Guest",
    email: apiCart.customer_email || "",
    phone: "", // Backend doesn't provide phone in abandoned cart data
    products: mapProducts(apiCart.items || []),
    cartValue: parseFloat(apiCart.grand_total) || 0,
    abandonedAt: formatDate(apiCart.abandoned_at),
    lastActivity: formatTimeAgo(apiCart.last_activity_at),
    recoveryStatus: mapRecoveryStatus(apiCart),
    emailSentAt: apiCart.recovery_email_sent_at || undefined,
    channel: mapChannel(apiCart.source),
  };
}

/**
 * Map recovery status based on email sent and conversion status
 */
function mapRecoveryStatus(cart: AbandonedCartApiItem): RecoveryStatus {
  if (cart.cart_status === "converted") {
    return "recovered";
  }
  if (cart.recovery_email_sent) {
    return "email-sent";
  }
  return "not-contacted";
}

/**
 * Map backend channel to frontend channel
 */
function mapChannel(source: string): "web" | "app" {
  return source === "app" ? "app" : "web";
}

/**
 * Map cart items to products
 */
function mapProducts(
  items: AbandonedCartApiItem["items"],
): AbandonedOrderProduct[] {
  if (!items || items.length === 0) return [];

  return items.map((item) => ({
    id: item.id,
    name: item.product_name,
    quantity: item.quantity,
    price: parseFloat(item.cost_price) || 0,
  }));
}

/**
 * Format date to readable string
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

/**
 * Format time ago string
 */
function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}
