export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          email: string
          experience_type: string
          guests: number
          id: string
          name: string
          notes: string | null
          phone: string
          status: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          email: string
          experience_type: string
          guests: number
          id?: string
          name: string
          notes?: string | null
          phone: string
          status?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          email?: string
          experience_type?: string
          guests?: number
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          status?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          product_count: number
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          product_count?: number
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          product_count?: number
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          product_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_slug_fkey"
            columns: ["product_slug"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["slug"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          name: string
          order_id: string
          order_vendor_id: string
          product_id: string
          qty: number
          unit_price: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          name: string
          order_id: string
          order_vendor_id: string
          product_id: string
          qty: number
          unit_price: number
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          name?: string
          order_id?: string
          order_vendor_id?: string
          product_id?: string
          qty?: number
          unit_price?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_vendor_id_fkey"
            columns: ["order_vendor_id"]
            isOneToOne: false
            referencedRelation: "order_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_vendors: {
        Row: {
          auto_confirm_at: string | null
          commission_amount: number
          commission_rate: number
          confirmed_at: string | null
          created_at: string
          delivered_at: string | null
          escrow_status: Database["public"]["Enums"]["escrow_status"]
          id: string
          items_subtotal: number
          net_amount: number
          order_id: string
          shipped_at: string | null
          shipping_fee: number
          tracking_carrier: string | null
          tracking_no: string | null
          vendor_id: string
        }
        Insert: {
          auto_confirm_at?: string | null
          commission_amount: number
          commission_rate: number
          confirmed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          escrow_status?: Database["public"]["Enums"]["escrow_status"]
          id?: string
          items_subtotal: number
          net_amount: number
          order_id: string
          shipped_at?: string | null
          shipping_fee?: number
          tracking_carrier?: string | null
          tracking_no?: string | null
          vendor_id: string
        }
        Update: {
          auto_confirm_at?: string | null
          commission_amount?: number
          commission_rate?: number
          confirmed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          escrow_status?: Database["public"]["Enums"]["escrow_status"]
          id?: string
          items_subtotal?: number
          net_amount?: number
          order_id?: string
          shipped_at?: string | null
          shipping_fee?: number
          tracking_carrier?: string | null
          tracking_no?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_vendors_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          grand_total: number
          id: string
          items_total: number
          payment_intent_id: string | null
          payment_provider:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_ref: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          ship_district: string | null
          ship_line: string | null
          ship_name: string | null
          ship_phone: string | null
          ship_province: string | null
          shipping_total: number
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          buyer_id: string
          created_at?: string
          grand_total?: number
          id?: string
          items_total?: number
          payment_intent_id?: string | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_ref?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          ship_district?: string | null
          ship_line?: string | null
          ship_name?: string | null
          ship_phone?: string | null
          ship_province?: string | null
          shipping_total?: number
          status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          buyer_id?: string
          created_at?: string
          grand_total?: number
          id?: string
          items_total?: number
          payment_intent_id?: string | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_ref?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          ship_district?: string | null
          ship_line?: string | null
          ship_name?: string | null
          ship_phone?: string | null
          ship_province?: string | null
          shipping_total?: number
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: []
      }
      payment_webhook_events: {
        Row: {
          created_at: string
          event_id: string
          order_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          event_id: string
          order_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          event_id?: string
          order_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_webhook_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          created_at: string
          iban: string | null
          id: string
          processed_at: string | null
          status: string
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          iban?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          iban?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          commission_rate: number
          escrow_auto_confirm_days: number
          free_shipping_threshold: number
          id: boolean
          shipping_fee: number
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          escrow_auto_confirm_days?: number
          free_shipping_threshold?: number
          id?: boolean
          shipping_fee?: number
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          escrow_auto_confirm_days?: number
          free_shipping_threshold?: number
          id?: boolean
          shipping_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          author: string
          created_at: string
          id: string
          location: string | null
          product_id: string
          rating: number
          text: string
          user_id: string | null
          vendor_id: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          location?: string | null
          product_id: string
          rating: number
          text: string
          user_id?: string | null
          vendor_id: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          location?: string | null
          product_id?: string
          rating?: number
          text?: string
          user_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          category_id: string
          cold_chain: boolean
          created_at: string
          description: string | null
          features: string[]
          gallery: string[]
          id: string
          image: string | null
          name: string
          old_price: number | null
          price: number
          rating: number
          region: string | null
          review_count: number
          slug: string
          status: string
          stock: number | null
          story: string | null
          tags: string[]
          unit: string
          vendor_id: string
        }
        Insert: {
          badge?: string | null
          category_id: string
          cold_chain?: boolean
          created_at?: string
          description?: string | null
          features?: string[]
          gallery?: string[]
          id?: string
          image?: string | null
          name: string
          old_price?: number | null
          price: number
          rating?: number
          region?: string | null
          review_count?: number
          slug: string
          status?: string
          stock?: number | null
          story?: string | null
          tags?: string[]
          unit: string
          vendor_id: string
        }
        Update: {
          badge?: string | null
          category_id?: string
          cold_chain?: boolean
          created_at?: string
          description?: string | null
          features?: string[]
          gallery?: string[]
          id?: string
          image?: string | null
          name?: string
          old_price?: number | null
          price?: number
          rating?: number
          region?: string | null
          review_count?: number
          slug?: string
          status?: string
          stock?: number | null
          story?: string | null
          tags?: string[]
          unit?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          suspended: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          suspended?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          suspended?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          body: string
          closed_at: string | null
          closed_by: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          replied_at: string | null
          replied_by: string | null
          reply_body: string | null
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          body: string
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          reply_body?: string | null
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          body?: string
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          reply_body?: string | null
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          created_at: string
          district: string | null
          document_back_url: string | null
          document_url: string | null
          iban: string
          id: string
          person: string
          phone: string
          province: string | null
          reject_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["application_status"]
          store_name: string
          story: string | null
          tc_no: string
          terms_accepted_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          document_back_url?: string | null
          document_url?: string | null
          iban: string
          id?: string
          person: string
          phone: string
          province?: string | null
          reject_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          store_name: string
          story?: string | null
          tc_no: string
          terms_accepted_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          district?: string | null
          document_back_url?: string | null
          document_url?: string | null
          iban?: string
          id?: string
          person?: string
          phone?: string
          province?: string | null
          reject_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          store_name?: string
          story?: string | null
          tc_no?: string
          terms_accepted_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          avatar: string | null
          badges: string[]
          balance: number
          commission_rate: number | null
          cover: string | null
          created_at: string
          district: string | null
          iban: string | null
          id: string
          location: string | null
          member_since: number | null
          name: string
          person: string
          positive_pct: number
          product_count: number
          province: string | null
          rating: number
          review_count: number
          slug: string
          story: string | null
          suspended: boolean
          units_sold: number
          user_id: string | null
          verified: boolean
        }
        Insert: {
          avatar?: string | null
          badges?: string[]
          balance?: number
          commission_rate?: number | null
          cover?: string | null
          created_at?: string
          district?: string | null
          iban?: string | null
          id?: string
          location?: string | null
          member_since?: number | null
          name: string
          person: string
          positive_pct?: number
          product_count?: number
          province?: string | null
          rating?: number
          review_count?: number
          slug: string
          story?: string | null
          suspended?: boolean
          units_sold?: number
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          avatar?: string | null
          badges?: string[]
          balance?: number
          commission_rate?: number | null
          cover?: string | null
          created_at?: string
          district?: string | null
          iban?: string | null
          id?: string
          location?: string | null
          member_since?: number | null
          name?: string
          person?: string
          positive_pct?: number
          product_count?: number
          province?: string | null
          rating?: number
          review_count?: number
          slug?: string
          story?: string | null
          suspended?: boolean
          units_sold?: number
          user_id?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      vendor_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          order_vendor_id: string | null
          type: Database["public"]["Enums"]["txn_type"]
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          order_vendor_id?: string | null
          type: Database["public"]["Enums"]["txn_type"]
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          order_vendor_id?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_transactions_order_vendor_id_fkey"
            columns: ["order_vendor_id"]
            isOneToOne: false
            referencedRelation: "order_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_dashboard: { Args: { p_days?: number }; Returns: Json }
      admin_delete_review: { Args: { p_id: string }; Returns: undefined }
      admin_set_user_role: {
        Args: {
          p_role: Database["public"]["Enums"]["user_role"]
          p_user: string
        }
        Returns: undefined
      }
      admin_set_user_suspended: {
        Args: { p_suspended: boolean; p_user: string }
        Returns: undefined
      }
      admin_set_vendor_suspended: {
        Args: { p_suspended: boolean; p_vendor: string }
        Returns: undefined
      }
      admin_set_vendor_verified: {
        Args: { p_vendor: string; p_verified: boolean }
        Returns: undefined
      }
      admin_stats: { Args: never; Returns: Json }
      approve_vendor_application: {
        Args: { p_app_id: string }
        Returns: string
      }
      confirm_received: {
        Args: { p_order_vendor_id: string }
        Returns: undefined
      }
      create_booking: {
        Args: {
          p_date: string
          p_email: string
          p_experience: string
          p_guests: number
          p_name: string
          p_notes: string
          p_phone: string
          p_time: string
        }
        Returns: string
      }
      create_order: { Args: { p_items: Json; p_ship: Json }; Returns: string }
      finalize_order_payment: {
        Args: {
          p_order_id: string
          p_provider: Database["public"]["Enums"]["payment_provider"]
          p_ref: string
        }
        Returns: undefined
      }
      mark_order_failed: {
        Args: { p_order_id: string; p_ref: string }
        Returns: undefined
      }
      mark_order_paid: {
        Args: {
          p_order_id: string
          p_provider: Database["public"]["Enums"]["payment_provider"]
          p_ref: string
          p_secret: string
        }
        Returns: undefined
      }
      mark_payout_paid: { Args: { p_payout_id: string }; Returns: undefined }
      mark_shipped: {
        Args: {
          p_carrier: string
          p_order_vendor_id: string
          p_tracking_no: string
        }
        Returns: undefined
      }
      my_review: { Args: { p_product_slug: string }; Returns: Json }
      open_dispute: { Args: { p_order_vendor_id: string }; Returns: undefined }
      refund_order: { Args: { p_ref: string }; Returns: undefined }
      reject_vendor_application: {
        Args: { p_app_id: string; p_reason: string }
        Returns: undefined
      }
      request_payout: { Args: { p_amount: number }; Returns: string }
      resolve_dispute: {
        Args: { p_action: string; p_order_vendor_id: string }
        Returns: undefined
      }
      submit_review: {
        Args: { p_product_slug: string; p_rating: number; p_text: string }
        Returns: undefined
      }
      update_vendor_profile: { Args: { p_patch: Json }; Returns: undefined }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      escrow_status:
        | "pending"
        | "shipped"
        | "delivered"
        | "released"
        | "refunded"
        | "disputed"
      order_status:
        | "pending"
        | "paid"
        | "partially_shipped"
        | "shipped"
        | "completed"
        | "cancelled"
        | "refunded"
      payment_provider: "stripe" | "iyzico"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      txn_type: "sale" | "commission" | "payout" | "refund" | "adjustment"
      user_role: "user" | "vendor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "approved", "rejected"],
      escrow_status: [
        "pending",
        "shipped",
        "delivered",
        "released",
        "refunded",
        "disputed",
      ],
      order_status: [
        "pending",
        "paid",
        "partially_shipped",
        "shipped",
        "completed",
        "cancelled",
        "refunded",
      ],
      payment_provider: ["stripe", "iyzico"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      txn_type: ["sale", "commission", "payout", "refund", "adjustment"],
      user_role: ["user", "vendor", "admin"],
    },
  },
} as const
