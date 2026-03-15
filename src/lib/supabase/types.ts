/**
 * Trendlo Supabase generated types
 *
 * These mirror the schema defined in `supabase/schema.sql`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_desc: string | null;
          price: string;
          compare_price: string | null;
          cost_price: string | null;
          cj_product_id: string | null;
          cj_variant_id: string;
          images: Json | null;
          variants: Json | null;
          category: string | null;
          tags: string[] | null;
          weight_grams: number | null;
          seo_title: string | null;
          seo_description: string | null;
          active: boolean | null;
          featured: boolean | null;
          stock: number | null;
          sold_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_desc?: string | null;
          price: string;
          compare_price?: string | null;
          cost_price?: string | null;
          cj_product_id?: string | null;
          cj_variant_id: string;
          images?: Json | null;
          variants?: Json | null;
          category?: string | null;
          tags?: string[] | null;
          weight_grams?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          active?: boolean | null;
          featured?: boolean | null;
          stock?: number | null;
          sold_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_desc?: string | null;
          price?: string;
          compare_price?: string | null;
          cost_price?: string | null;
          cj_product_id?: string | null;
          cj_variant_id?: string;
          images?: Json | null;
          variants?: Json | null;
          category?: string | null;
          tags?: string[] | null;
          weight_grams?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          active?: boolean | null;
          featured?: boolean | null;
          stock?: number | null;
          sold_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          cj_order_id: string | null;
          items: Json;
          subtotal: string;
          discount_amt: string | null;
          total_paid: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          ref_code: string | null;
          discount_code: string | null;
          payment_status: string | null;
          fulfillment_status: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          shipping_name: string;
          shipping_phone: string;
          shipping_email: string;
          shipping_address: string;
          shipping_city: string;
          shipping_state: string;
          shipping_pincode: string;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          cj_order_id?: string | null;
          items: Json;
          subtotal: string;
          discount_amt?: string | null;
          total_paid: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ref_code?: string | null;
          discount_code?: string | null;
          payment_status?: string | null;
          fulfillment_status?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          shipping_name: string;
          shipping_phone: string;
          shipping_email: string;
          shipping_address: string;
          shipping_city: string;
          shipping_state: string;
          shipping_pincode: string;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          cj_order_id?: string | null;
          items?: Json;
          subtotal?: string;
          discount_amt?: string | null;
          total_paid?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ref_code?: string | null;
          discount_code?: string | null;
          payment_status?: string | null;
          fulfillment_status?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          shipping_name?: string;
          shipping_phone?: string;
          shipping_email?: string;
          shipping_address?: string;
          shipping_city?: string;
          shipping_state?: string;
          shipping_pincode?: string;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          type: "percent" | "flat" | null;
          value: string;
          min_order: string | null;
          ref_name: string | null;
          uses: number | null;
          max_uses: number | null;
          active: boolean | null;
          expires_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          type?: "percent" | "flat" | null;
          value: string;
          min_order?: string | null;
          ref_name?: string | null;
          uses?: number | null;
          max_uses?: number | null;
          active?: boolean | null;
          expires_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          type?: "percent" | "flat" | null;
          value?: string;
          min_order?: string | null;
          ref_name?: string | null;
          uses?: number | null;
          max_uses?: number | null;
          active?: boolean | null;
          expires_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      order_analytics: {
        Row: {
          date: string | null;
          utm_source: string | null;
          utm_campaign: string | null;
          orders: number | null;
          revenue: string | null;
          avg_order_value: string | null;
        };
        Insert: any;
        Update: any;
        Relationships: [];
      };
    };
    Functions: {
      update_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      increment_discount_uses: {
        Args: { discount_code_input: string };
        Returns: unknown;
      };
      increment_column: {
        Args: {
          table_name: string;
          column_name: string;
          row_id: string;
          increment_by: number;
        };
        Returns: number;
      };
    };
    Enums: {
      // No enums in Trendlo public schema yet
    };
  };
}

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type DiscountCodeRow =
  Database["public"]["Tables"]["discount_codes"]["Row"];
export type OrderAnalyticsRow =
  Database["public"]["Views"]["order_analytics"]["Row"];

