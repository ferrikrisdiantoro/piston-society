export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cars: {
        Relationships: [
          {
            foreignKeyName: 'car_images_car_id_fkey'
            columns: ['id']
            isOneToOne: false
            referencedRelation: 'car_images'
            referencedColumns: ['car_id']
          },
          {
            foreignKeyName: 'enquiries_car_interested_fkey'
            columns: ['id']
            isOneToOne: false
            referencedRelation: 'enquiries'
            referencedColumns: ['car_interested']
          }
        ]
        Row: {
          id: string
          make: string
          model: string
          year: number
          badge: string | null
          body_type: string
          transmission: string
          fuel_type: string
          engine: string | null
          seats: number
          drivetrain: string | null
          colour: string | null
          location: string | null
          price_weekly: number
          price_monthly: number | null
          upfront_fee: number
          minimum_term_weeks: number
          description: string | null
          features_included: string[]
          is_featured: boolean
          is_available: boolean
          badge_label: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          badge?: string | null
          body_type: string
          transmission: string
          fuel_type: string
          engine?: string | null
          seats?: number
          drivetrain?: string | null
          colour?: string | null
          location?: string | null
          price_weekly: number
          price_monthly?: number | null
          upfront_fee?: number
          minimum_term_weeks?: number
          description?: string | null
          features_included?: string[]
          is_featured?: boolean
          is_available?: boolean
          badge_label?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year?: number
          badge?: string | null
          body_type?: string
          transmission?: string
          fuel_type?: string
          engine?: string | null
          seats?: number
          drivetrain?: string | null
          colour?: string | null
          location?: string | null
          price_weekly?: number
          price_monthly?: number | null
          upfront_fee?: number
          minimum_term_weeks?: number
          description?: string | null
          features_included?: string[]
          is_featured?: boolean
          is_available?: boolean
          badge_label?: string | null
          updated_at?: string
        }
      }
      car_images: {
        Relationships: [
          {
            foreignKeyName: 'car_images_car_id_fkey'
            columns: ['car_id']
            isOneToOne: false
            referencedRelation: 'cars'
            referencedColumns: ['id']
          }
        ]
        Row: {
          id: string
          car_id: string
          image_url: string
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          car_id: string
          image_url: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          image_url?: string
          display_order?: number
          is_primary?: boolean
        }
      }
      enquiries: {
        Relationships: [
          {
            foreignKeyName: 'enquiries_car_interested_fkey'
            columns: ['car_interested']
            isOneToOne: false
            referencedRelation: 'cars'
            referencedColumns: ['id']
          }
        ]
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          age: number | null
          car_interested: string | null
          car_name_snapshot: string | null
          rental_duration: string | null
          message: string | null
          status: 'new' | 'contacted' | 'closed'
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          age?: number | null
          car_interested?: string | null
          car_name_snapshot?: string | null
          rental_duration?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          age?: number | null
          car_interested?: string | null
          car_name_snapshot?: string | null
          rental_duration?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'closed'
        }
      }
      testimonials: {
        Relationships: []
        Row: {
          id: string
          name: string
          rating: number
          review: string
          location: string | null
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          rating?: number
          review: string
          location?: string | null
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          rating?: number
          review?: string
          location?: string | null
          is_visible?: boolean
        }
      }
      faqs: {
        Relationships: []
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          display_order: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          display_order?: number
          is_visible?: boolean
        }
      }
      page_contents: {
        Relationships: []
        Row: {
          id: string
          page_slug: string
          meta_title: string | null
          meta_description: string | null
          hero_title: string | null
          hero_subtitle: string | null
          content: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          page_slug: string
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          content?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          page_slug?: string
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          content?: Json | null
          updated_at?: string
        }
      }
      site_settings: {
        Relationships: []
        Row: {
          id: string
          key: string
          value: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ─── Convenience types (extracted from Database) ──────────────────────────────
export type Car = Database['public']['Tables']['cars']['Row']
export type CarInsert = Database['public']['Tables']['cars']['Insert']
export type CarUpdate = Database['public']['Tables']['cars']['Update']
export type CarImage = Database['public']['Tables']['car_images']['Row']
export type CarImageInsert = Database['public']['Tables']['car_images']['Insert']
export type Enquiry = Database['public']['Tables']['enquiries']['Row']
export type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert']
export type EnquiryUpdate = Database['public']['Tables']['enquiries']['Update']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert']
export type FAQ = Database['public']['Tables']['faqs']['Row']
export type FAQInsert = Database['public']['Tables']['faqs']['Insert']
export type PageContent = Database['public']['Tables']['page_contents']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

export type CarWithImages = Car & { car_images: CarImage[] }

export interface CarFilters {
  make?: string[]
  body_type?: string[]
  transmission?: string[]
  fuel_type?: string[]
  price_min?: number
  price_max?: number
  location?: string
}

export type CarSortOption = 'newest' | 'price_asc' | 'price_desc'
