-- ============================================================
-- PISTON SOCIETY — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── CARS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  badge VARCHAR(50),
  body_type VARCHAR(50) NOT NULL,
  transmission VARCHAR(20) NOT NULL,
  fuel_type VARCHAR(30) NOT NULL,
  engine VARCHAR(50),
  seats INTEGER DEFAULT 5,
  drivetrain VARCHAR(30),
  colour VARCHAR(30),
  location VARCHAR(100),
  price_weekly DECIMAL(10,2) NOT NULL,
  price_monthly DECIMAL(10,2),
  upfront_fee DECIMAL(10,2) DEFAULT 0,
  minimum_term_weeks INTEGER DEFAULT 1,
  description TEXT,
  features_included TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  badge_label VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- ─── CAR IMAGES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS car_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENQUIRIES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  age INTEGER,
  car_interested UUID REFERENCES cars(id) ON DELETE SET NULL,
  car_name_snapshot VARCHAR(200),
  rental_duration VARCHAR(100),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  location VARCHAR(100),
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAQS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAGE CONTENTS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug VARCHAR(50) UNIQUE NOT NULL,
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  hero_title VARCHAR(300),
  hero_subtitle TEXT,
  content JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SITE SETTINGS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ─── CARS ────────────────────────────────────────────────────────────────────
CREATE POLICY "cars_public_read" ON cars FOR SELECT USING (true);
CREATE POLICY "cars_admin_write" ON cars FOR ALL USING (auth.role() = 'authenticated');

-- ─── CAR IMAGES ──────────────────────────────────────────────────────────────
CREATE POLICY "car_images_public_read" ON car_images FOR SELECT USING (true);
CREATE POLICY "car_images_admin_write" ON car_images FOR ALL USING (auth.role() = 'authenticated');

-- ─── ENQUIRIES ───────────────────────────────────────────────────────────────
-- Public can submit enquiries
CREATE POLICY "enquiries_public_insert" ON enquiries FOR INSERT WITH CHECK (true);
-- Only authenticated admins can read/update/delete
CREATE POLICY "enquiries_admin_read" ON enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "enquiries_admin_update" ON enquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "enquiries_admin_delete" ON enquiries FOR DELETE USING (auth.role() = 'authenticated');

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_admin_write" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- ─── FAQS ────────────────────────────────────────────────────────────────────
CREATE POLICY "faqs_public_read" ON faqs FOR SELECT USING (true);
CREATE POLICY "faqs_admin_write" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- ─── PAGE CONTENTS ───────────────────────────────────────────────────────────
CREATE POLICY "page_contents_public_read" ON page_contents FOR SELECT USING (true);
CREATE POLICY "page_contents_admin_write" ON page_contents FOR ALL USING (auth.role() = 'authenticated');

-- ─── SITE SETTINGS ───────────────────────────────────────────────────────────
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================

-- ─── CARS SEED ───────────────────────────────────────────────────────────────
INSERT INTO cars (make, model, year, badge, body_type, transmission, fuel_type, engine, seats, drivetrain, colour, location, price_weekly, upfront_fee, minimum_term_weeks, description, features_included, is_featured, is_available, badge_label) VALUES
(
  'Toyota', 'Corolla', 2024, 'Ascent Sport', 'Hatchback', 'Automatic', 'Petrol', '2.0L 4-Cylinder', 5, 'FWD', 'Glacier White', 'Sydney',
  179.00, 300.00, 1,
  'The Toyota Corolla Ascent Sport is the perfect everyday hatchback — fuel-efficient, reliable, and packed with features. Apple CarPlay, Android Auto, and Toyota Safety Sense come standard.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  true, true, 'Popular'
),
(
  'Mazda', 'CX-5', 2024, 'Maxx Sport', 'SUV', 'Automatic', 'Petrol', '2.5L 4-Cylinder', 5, 'AWD', 'Polymetal Grey', 'Melbourne',
  249.00, 500.00, 1,
  'The Mazda CX-5 Maxx Sport is a premium SUV that combines striking design with Mazda''s renowned driving dynamics. KODO design language, i-Activ AWD, and Mazda Connect infotainment.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  true, true, 'Popular'
),
(
  'Hyundai', 'Tucson', 2023, 'Active', 'SUV', 'Automatic', 'Petrol', '2.0L 4-Cylinder', 5, 'FWD', 'Phantom Black', 'Brisbane',
  229.00, 400.00, 1,
  'Bold, modern, and exceptionally well-equipped. The Hyundai Tucson Active brings a fresh design and smart safety technology to your everyday drive.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  false, true, NULL
),
(
  'Kia', 'Cerato', 2024, 'Sport', 'Sedan', 'Automatic', 'Petrol', '2.0L 4-Cylinder', 5, 'FWD', 'Snow White Pearl', 'Sydney',
  189.00, 350.00, 1,
  'The Kia Cerato Sport offers sporty styling and a feature-packed cabin at an accessible price point. Wireless Apple CarPlay, 10.25" infotainment screen, and Kia''s 7-year warranty history.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  false, true, 'New'
),
(
  'Toyota', 'RAV4', 2024, 'GXL Hybrid', 'SUV', 'Automatic', 'Hybrid', '2.5L 4-Cylinder Hybrid', 5, 'AWD', 'Oxide Bronze', 'Melbourne',
  289.00, 600.00, 2,
  'The Toyota RAV4 GXL Hybrid combines exceptional fuel efficiency with AWD capability. Self-charging hybrid technology means no plugging in — just drive and save.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  true, true, 'Best Value'
),
(
  'BMW', '320i', 2023, 'M Sport', 'Sedan', 'Automatic', 'Petrol', '2.0L TwinPower Turbo', 5, 'RWD', 'Black Sapphire', 'Sydney',
  349.00, 800.00, 2,
  'Experience the thrill of driving a BMW 320i M Sport — the benchmark for sports sedans. M Aerodynamics package, sport suspension, and BMW''s iconic driving dynamics.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  true, true, NULL
),
(
  'Mercedes-Benz', 'A250', 2023, 'AMG Line', 'Hatchback', 'Automatic', 'Petrol', '2.0L Turbocharged', 5, 'FWD', 'Polar White', 'Melbourne',
  369.00, 800.00, 4,
  'The Mercedes-Benz A250 AMG Line blends premium luxury with everyday practicality. MBUX infotainment system, AMG bodykit, and that unmistakable three-pointed star.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  false, true, NULL
),
(
  'Volkswagen', 'Golf GTI', 2024, NULL, 'Hatchback', 'Automatic', 'Petrol', '2.0L TSI Turbocharged', 5, 'FWD', 'Deep Black Pearl', 'Brisbane',
  299.00, 600.00, 1,
  'The Volkswagen Golf GTI is the original hot hatch — refined, quick, and endlessly enjoyable. 180kW, DSG transmission, and an interior that punches above its class.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  false, true, 'New'
),
(
  'Ford', 'Ranger', 2024, 'XLT', 'Ute', 'Automatic', 'Diesel', '2.0L Bi-Turbo Diesel', 5, 'AWD', 'Meteor Grey', 'Brisbane',
  319.00, 650.00, 2,
  'Australia''s best-selling ute for good reason. The Ford Ranger XLT delivers serious work capability with genuine comfort. 3.5T towing, 1.36T payload, and Apple CarPlay.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  true, true, 'Popular'
),
(
  'Tesla', 'Model 3', 2024, NULL, 'Sedan', 'Automatic', 'Electric', 'Dual Motor Electric', 5, 'AWD', 'Pearl White Multi-Coat', 'Sydney',
  379.00, 800.00, 4,
  'Drive the future today with the Tesla Model 3. 0-100km/h in 4.4 seconds, 576km range, Autopilot, and over-the-air software updates. No fuel costs — just pure electric performance.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  true, true, NULL
),
(
  'Mitsubishi', 'Outlander', 2024, 'ES', 'SUV', 'Automatic', 'Petrol', '2.5L 4-Cylinder', 7, 'AWD', 'Titanium Grey', 'Melbourne',
  219.00, 400.00, 1,
  'The Mitsubishi Outlander ES offers 7-seat practicality with S-AWC all-wheel control. Perfect for families who need space without compromising on capability or style.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  false, true, NULL
),
(
  'Honda', 'CR-V', 2024, 'VTi', 'SUV', 'Automatic', 'Petrol', '1.5L VTEC Turbo', 5, 'AWD', 'Lunar Silver', 'Sydney',
  259.00, 500.00, 1,
  'The Honda CR-V VTi delivers a refined driving experience with Honda''s legendary reliability. Turbocharged efficiency, spacious interior, and Honda Sensing safety suite.',
  ARRAY['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist'],
  false, true, 'New'
);

-- ─── CAR IMAGES SEED ─────────────────────────────────────────────────────────
-- Insert primary images for each car (using Unsplash)
DO $$
DECLARE
  car_id UUID;
  img_urls TEXT[][] := ARRAY[
    ARRAY['Toyota', 'Corolla', 'https://images.unsplash.com/photo-1625231337606-fd5a5e9e8a0a?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Mazda', 'CX-5', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Hyundai', 'Tucson', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Kia', 'Cerato', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Toyota', 'RAV4', 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=800&q=80'],
    ARRAY['BMW', '320i', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Mercedes-Benz', 'A250', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Volkswagen', 'Golf GTI', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Ford', 'Ranger', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Tesla', 'Model 3', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Mitsubishi', 'Outlander', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'],
    ARRAY['Honda', 'CR-V', 'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=800&q=80']
  ];
  img_entry TEXT[];
BEGIN
  FOREACH img_entry SLICE 1 IN ARRAY img_urls
  LOOP
    SELECT id INTO car_id FROM cars WHERE make = img_entry[1] AND model = img_entry[2] LIMIT 1;
    IF car_id IS NOT NULL THEN
      INSERT INTO car_images (car_id, image_url, display_order, is_primary)
      VALUES (car_id, img_entry[3], 0, true);
    END IF;
  END LOOP;
END $$;

-- ─── TESTIMONIALS SEED ───────────────────────────────────────────────────────
INSERT INTO testimonials (name, rating, review, location, is_visible) VALUES
('Liam Thompson', 5, 'Absolutely love the service! Got my RAV4 sorted within 2 days and everything was included. No more dealing with insurance renewals or rego — it''s all done for me. Highly recommend Piston Society.', 'Sydney, NSW', true),
('Sarah Mitchell', 5, 'As someone who travels for work, having a reliable car without the commitment of buying was a game-changer. The team was super responsive and the whole process took less than a week. 10/10.', 'Melbourne, VIC', true),
('James Nguyen', 5, 'I was sceptical at first, but the transparency of the pricing won me over. What you see is what you pay — no nasty surprises at the end of the month. Great selection of cars too!', 'Brisbane, QLD', true),
('Emma Williams', 5, 'The Tesla Model 3 subscription was perfect for my 3-month contract work in Sydney. Roadside assist saved me once too — they were there within 30 minutes. Outstanding service.', 'Sydney, NSW', true),
('Daniel Okafor', 5, 'Way better than traditional leasing. I switched from a 3-year lease to Piston Society and I''m saving money while having more flexibility. Should have done this years ago!', 'Perth, WA', true),
('Olivia Chen', 5, 'The booking process is seamless and the team is always available to help. I''ve been a subscriber for 6 months now and just renewed. The car is always clean and well-maintained.', 'Melbourne, VIC', true);

-- ─── FAQs SEED ───────────────────────────────────────────────────────────────
INSERT INTO faqs (question, answer, category, display_order, is_visible) VALUES
('What is a car subscription?', 'A car subscription is a flexible way to drive a car without the commitment of buying or leasing. You pay a weekly fee that covers everything — insurance, registration, servicing, and roadside assist.', 'General', 1, true),
('How is this different from traditional car rental?', 'Unlike short-term rental, our subscriptions are designed for long-term use with all costs bundled in. No surprise bills, no hidden fees. Think of it as having your own car, without the hassle of ownership.', 'General', 2, true),
('Can I cancel anytime?', 'After your minimum term, you can give notice to end your subscription. We require advance notice as per the subscription agreement — our team will confirm the exact notice period for your plan.', 'General', 3, true),
('Can I extend my subscription?', 'Absolutely! You can extend your subscription at any time by contacting our team. We''ll confirm the rate and update your agreement accordingly.', 'General', 4, true),
('What documents do I need?', 'You''ll need a valid Australian driver''s licence, proof of address, and a phone number for contact. Additional documentation may be requested during the approval process.', 'General', 5, true),
('Are there any hidden fees?', 'No. The weekly price you see includes registration, insurance, CTP, servicing, maintenance, and roadside assistance. The only additional cost is fuel.', 'Pricing', 6, true),
('What is the upfront fee?', 'The upfront fee is a one-time payment when you start your subscription. It covers administrative and vehicle preparation costs. The amount varies by vehicle — check each car''s listing for details.', 'Pricing', 7, true),
('What is the minimum subscription period?', 'Our minimum subscription period varies by vehicle, starting from as little as 1 week. You can see the minimum term on each car''s listing page.', 'Pricing', 8, true),
('Can I switch cars during my subscription?', 'Please contact our team to discuss switching options. We''ll do our best to accommodate your needs, subject to vehicle availability.', 'Vehicles', 9, true),
('What happens if the car breaks down?', '24/7 roadside assistance is included in your subscription. If the vehicle has a mechanical issue covered by our maintenance policy, we will repair it at no cost to you.', 'Vehicles', 10, true),
('What condition are the vehicles in?', 'All vehicles are thoroughly inspected and cleaned before handover. We only subscribe well-maintained vehicles that meet our quality standards.', 'Vehicles', 11, true),
('What insurance is included?', 'Comprehensive motor vehicle insurance is included in your subscription, along with CTP (Compulsory Third Party) insurance. You do not need to arrange your own insurance.', 'Insurance', 12, true),
('What if I have an accident?', 'Contact us immediately if you are involved in an accident. Comprehensive insurance is included, but an excess may apply depending on circumstances. Our team will guide you through the claims process.', 'Insurance', 13, true),
('Am I covered to drive interstate?', 'Yes, your subscription vehicle is covered for driving anywhere within Australia. Please notify us if you plan an extended interstate trip.', 'Insurance', 14, true);

-- ─── SITE SETTINGS SEED ──────────────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
('whatsapp_number', '+61422663888'),
('business_email', 'info@pistonsociety.com.au'),
('business_phone', '+61 422 663 888'),
('business_address', 'Sydney, NSW, Australia'),
('instagram_url', 'https://instagram.com/pistonsociety'),
('facebook_url', 'https://facebook.com/pistonsociety'),
('tiktok_url', 'https://tiktok.com/@pistonsociety'),
('google_maps_embed', '');

-- ─── PAGE CONTENTS SEED ──────────────────────────────────────────────────────
INSERT INTO page_contents (page_slug, meta_title, meta_description, hero_title, hero_subtitle) VALUES
('home', 'Piston Society | Car Subscription & Long-Term Rental Australia', 'Flexible car subscriptions in Australia from $179/week. All-inclusive — insurance, registration, CTP, servicing & roadside assist. No lock-in contracts.', 'Drive Your Dream Car. No Lock-In.', 'Flexible car subscriptions in Australia. All-inclusive — insurance, registration, servicing & roadside assist included.'),
('about', 'About Piston Society | Car Subscription Australia', 'Learn about Piston Society — Australia''s premium car subscription service operating in Sydney, Melbourne, Brisbane, Perth and Adelaide.', 'About Piston Society', 'We''re on a mission to make premium car access simple, flexible, and stress-free for every Australian.'),
('how-it-works', 'How Car Subscription Works | Piston Society', 'Learn how Piston Society''s car subscription works in 3 easy steps. Browse, enquire, and drive away — all within 48 hours.', 'How Car Subscription Works', 'Get behind the wheel in 3 simple steps.'),
('contact', 'Contact Us | Piston Society', 'Get in touch with Piston Society. Submit a car subscription enquiry and our team will get back to you within 24 hours.', 'Contact Us', 'Ready to start your subscription? We''d love to hear from you.'),
('faq', 'FAQ | Piston Society', 'Frequently asked questions about Piston Society car subscriptions — pricing, insurance, vehicles, eligibility and more.', 'Frequently Asked Questions', 'Everything you need to know about Piston Society.'),
('terms', 'Terms & Conditions | Piston Society', 'Piston Society Terms and Conditions for car subscription services in Australia.', 'Terms & Conditions', NULL),
('privacy', 'Privacy Policy | Piston Society', 'Piston Society Privacy Policy — how we collect, use, and protect your personal information.', 'Privacy Policy', NULL);
