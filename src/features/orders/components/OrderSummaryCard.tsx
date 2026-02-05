import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '../utils/orderCalculations';
import type { OrderSummaryCardProps } from '../types/component.types';

export function OrderSummaryCard({
  pricing,
  currency,
  itemsCount,
  orderStatus,
  salesChannel,
}: OrderSummaryCardProps) {
  const {
    subtotal,
    productDiscountsTotal,
    orderDiscount,
    taxType,
    cgst,
    sgst,
    igst,
    shippingCharge,
    codCharge,
    giftCardAmount,
    grandTotal,
    advancePaid,
    balanceDue,
  } = pricing;

  const totalAfterProductDiscounts = subtotal - productDiscountsTotal;

  return (
    <div className="lg:sticky lg:top-6">
      <Card className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
          <p className="text-sm text-slate-500 mt-1">
            Review your order details
          </p>
        </div>

        <Separator />

        {/* Order Status Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Status</span>
            <Badge
              variant={orderStatus === 'paid' ? 'default' : orderStatus === 'confirmed' ? 'secondary' : 'outline'}
            >
              {orderStatus === 'draft' && 'Draft'}
              {orderStatus === 'confirmed' && 'Confirmed'}
              {orderStatus === 'paid' && 'Paid'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Channel</span>
            <span className="text-sm font-medium text-slate-900 capitalize">
              {salesChannel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Items</span>
            <span className="text-sm font-medium text-slate-900">
              {itemsCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Currency</span>
            <span className="text-sm font-medium text-slate-900">
              {currency}
            </span>
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Item Subtotal</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>

          {/* Product Discounts */}
          {productDiscountsTotal > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Product Discounts</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(productDiscountsTotal, currency)}
              </span>
            </div>
          )}

          {/* Subtotal after product discounts */}
          {productDiscountsTotal > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(totalAfterProductDiscounts, currency)}
              </span>
            </div>
          )}

          {/* Order Discount */}
          {orderDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Order Discount</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(orderDiscount, currency)}
              </span>
            </div>
          )}

          <Separator className="my-2" />

          {/* Tax */}
          {taxType !== 'none' && (
            <div className="space-y-2 bg-slate-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-slate-700 uppercase mb-1">
                {taxType === 'cgst_sgst' ? 'GST (Intra-State)' : 'IGST (Inter-State)'}
              </div>

              {taxType === 'cgst_sgst' ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      CGST ({pricing.cgstRate}%)
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(cgst, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      SGST ({pricing.sgstRate}%)
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(sgst, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-700 font-medium">Total Tax</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(cgst + sgst, currency)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    IGST ({pricing.igstRate}%)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(igst, currency)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Shipping Charge */}
          {shippingCharge > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(shippingCharge, currency)}
              </span>
            </div>
          )}

          {/* COD Charge */}
          {codCharge > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">COD Charge</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(codCharge, currency)}
              </span>
            </div>
          )}

          {/* Gift Card */}
          {giftCardAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Gift Card</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(giftCardAmount, currency)}
              </span>
            </div>
          )}

          <Separator className="my-3" />

          {/* Grand Total */}
          <div className="flex items-center justify-between py-2 bg-purple-50 rounded-lg px-3">
            <span className="text-base font-semibold text-slate-900">
              Grand Total
            </span>
            <span className="text-xl font-bold text-purple-700">
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>

          {/* Advance Paid & Balance Due */}
          {advancePaid > 0 && (
            <div className="space-y-2 bg-blue-50 rounded-lg p-3 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 font-medium">Advance Paid</span>
                <span className="font-semibold text-blue-700">
                  {formatCurrency(advancePaid, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="text-base font-semibold text-slate-900">
                  Balance Due
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(balanceDue, currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
