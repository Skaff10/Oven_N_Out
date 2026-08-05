import { CartItem } from "@/types";
import { DELIVERY_FEE } from "@/config/constants";

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  deliveryFee?: number;
  showDetails?: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  deliveryFee = DELIVERY_FEE,
  showDetails = true,
}: OrderSummaryProps) {
  const currentDeliveryFee = deliveryFee;
  const total = subtotal + currentDeliveryFee;

  return (
    <div className="bg-accent border border-dark-border rounded-2xl p-6 space-y-5">
      <h3 className="font-heading text-lg text-primary border-b border-dark-border pb-3">
        ORDER SUMMARY
      </h3>

      {/* Item List */}
      <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hide pr-1">
        {items.map((item, idx) => {
          const qty = item.quantity ?? item.qty ?? 1;
          const price = item.price ?? item.unitPrice ?? 0;
          return (
            <div key={idx} className="flex gap-3 items-start justify-between">
              <div className="flex gap-3">
                <div className="min-w-0">
                  <p className="font-body text-sm text-primary font-medium truncate">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="font-body text-xs text-text">
                      Quantity: {qty}
                    </span>
                    {item.variant && (
                      <>
                        <span className="text-text text-xs">•</span>
                        <span className="font-body text-xs text-text">
                          {item.variant}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className="font-heading text-sm text-text/80 whitespace-nowrap">
                {price * qty} <span>tk</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary lines */}
      <div className="border-t border-dark-border pt-4 space-y-2.5 font-body text-sm">
        <div className="flex justify-between text-text">
          <span>Subtotal</span>
          <span>
            {subtotal} <span>tk</span>
          </span>
        </div>

        <div className="flex justify-between text-text">
          <span>Delivery Fee</span>
          <span>
            {currentDeliveryFee} <span>tk</span>
          </span>
        </div>

        <div className="flex justify-between font-heading text-lg text-primary pt-3 border-t border-dark-border/40">
          <span>Total</span>
          <span className="text-primary">
            {total} <span>tk</span>
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="bg-primary rounded-xl p-4 font-body text-xs text-secondary/50 space-y-1.5 border border-dark-border/30">
          <p className="font-semibold text-secondary">Payment Method:</p>
          <p>Cash on Delivery (COD) only for now.</p>
        </div>
      )}
    </div>
  );
}
