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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      career_timeline: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          key_achievement: string | null
          profile_id: string
          role: string
          sort_order: number
          start_date: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          key_achievement?: string | null
          profile_id: string
          role: string
          sort_order?: number
          start_date: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          key_achievement?: string | null
          profile_id?: string
          role?: string
          sort_order?: number
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_timeline_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          approach: string | null
          challenge: string | null
          created_at: string
          id: string
          metrics: Json | null
          profile_id: string
          results: string | null
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approach?: string | null
          challenge?: string | null
          created_at?: string
          id?: string
          metrics?: Json | null
          profile_id: string
          results?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approach?: string | null
          challenge?: string | null
          created_at?: string
          id?: string
          metrics?: Json | null
          profile_id?: string
          results?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          profile_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          profile_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          profile_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_responses: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          profile_id: string | null
          question_category: string
          question_id: number
          question_text: string
          response_method: string | null
          response_text: string | null
          skipped: boolean | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          question_category: string
          question_id: number
          question_text: string
          response_method?: string | null
          response_text?: string | null
          skipped?: boolean | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          question_category?: string
          question_id?: number
          question_text?: string
          response_method?: string | null
          response_text?: string | null
          skipped?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_conversations: {
        Row: {
          created_at: string
          extracted_data: Json | null
          id: string
          messages: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          extracted_data?: Json | null
          id?: string
          messages?: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          extracted_data?: Json | null
          id?: string
          messages?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_artifacts: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          profile_id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          profile_id: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_sections: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          profile_id: string
          section_data: Json
          section_order: number
          section_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          profile_id: string
          section_data?: Json
          section_order?: number
          section_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          profile_id?: string
          section_data?: Json
          section_order?: number
          section_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_sections_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_versions: {
        Row: {
          created_at: string
          customized_bio: string | null
          customized_headline: string | null
          expiry_date: string | null
          id: string
          is_default: boolean
          is_published: boolean
          profile_id: string
          slug: string | null
          target_company: string | null
          target_role: string | null
          updated_at: string
          user_id: string
          version_name: string
          visible_sections: Json | null
        }
        Insert: {
          created_at?: string
          customized_bio?: string | null
          customized_headline?: string | null
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          is_published?: boolean
          profile_id: string
          slug?: string | null
          target_company?: string | null
          target_role?: string | null
          updated_at?: string
          user_id: string
          version_name?: string
          visible_sections?: Json | null
        }
        Update: {
          created_at?: string
          customized_bio?: string | null
          customized_headline?: string | null
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          is_published?: boolean
          profile_id?: string
          slug?: string | null
          target_company?: string | null
          target_role?: string | null
          updated_at?: string
          user_id?: string
          version_name?: string
          visible_sections?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_versions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          profile_version_id: string
          referrer: string | null
          sections_viewed: string[] | null
          time_on_page_seconds: number | null
          viewed_at: string
          viewer_ip: string | null
          viewer_user_agent: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          profile_version_id: string
          referrer?: string | null
          sections_viewed?: string[] | null
          time_on_page_seconds?: number | null
          viewed_at?: string
          viewer_ip?: string | null
          viewer_user_agent?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          profile_version_id?: string
          referrer?: string | null
          sections_viewed?: string[] | null
          time_on_page_seconds?: number | null
          viewed_at?: string
          viewer_ip?: string | null
          viewer_user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_profile_version_id_fkey"
            columns: ["profile_version_id"]
            isOneToOne: false
            referencedRelation: "profile_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_type: string | null
          banner_url: string | null
          banner_value: string | null
          bio: string | null
          created_at: string
          full_name: string
          headline: string | null
          id: string
          industry: string | null
          is_pro: boolean
          location: string | null
          marketing_opted_in: boolean
          onboarding_completed: boolean
          slug: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          theme_base: string | null
          theme_primary_color: string | null
          theme_secondary_color: string | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          banner_type?: string | null
          banner_url?: string | null
          banner_value?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          headline?: string | null
          id?: string
          industry?: string | null
          is_pro?: boolean
          location?: string | null
          marketing_opted_in?: boolean
          onboarding_completed?: boolean
          slug?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          theme_base?: string | null
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          banner_type?: string | null
          banner_url?: string | null
          banner_value?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          headline?: string | null
          id?: string
          industry?: string | null
          is_pro?: boolean
          location?: string | null
          marketing_opted_in?: boolean
          onboarding_completed?: boolean
          slug?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          theme_base?: string | null
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      section_templates: {
        Row: {
          created_at: string
          description: string
          display_name: string
          icon_name: string
          id: string
          is_core: boolean
          recommended_for: string[]
          section_type: string
          template_structure: Json
        }
        Insert: {
          created_at?: string
          description?: string
          display_name: string
          icon_name?: string
          id?: string
          is_core?: boolean
          recommended_for?: string[]
          section_type: string
          template_structure?: Json
        }
        Update: {
          created_at?: string
          description?: string
          display_name?: string
          icon_name?: string
          id?: string
          is_core?: boolean
          recommended_for?: string[]
          section_type?: string
          template_structure?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          proficiency: number | null
          profile_id: string
          sort_order: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          proficiency?: number | null
          profile_id: string
          sort_order?: number
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          proficiency?: number | null
          profile_id?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_company: string | null
          author_name: string
          author_role: string | null
          created_at: string
          id: string
          profile_id: string
          quote: string
          sort_order: number
          user_id: string
        }
        Insert: {
          author_company?: string | null
          author_name: string
          author_role?: string | null
          created_at?: string
          id?: string
          profile_id: string
          quote: string
          sort_order?: number
          user_id: string
        }
        Update: {
          author_company?: string | null
          author_name?: string
          author_role?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          quote?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_profile_slug: { Args: { full_name: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
