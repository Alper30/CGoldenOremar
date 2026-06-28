-- Golden Oremar — Katalog çekirdeği tohum verisi (lib/data.ts'ten birebir)
-- Tekrar çalıştırılabilir: on conflict (slug) do update.

-- ---------- categories ----------
insert into public.categories (slug, name, description, image, product_count, sort_order) values
  ('bal',              'Bal',                'Karakovan, çiçek balı, petek.',            '/images/cat-honey.png',    142, 1),
  ('sut-urunleri',     'Süt Ürünleri',       'Tulum peyniri, tereyağı, çökelek.',        '/images/cat-dairy.png',     98, 2),
  ('zeytin-zeytinyagi','Zeytin & Zeytinyağı','Erken hasat sızma, sele zeytin.',          '/images/cat-olive.png',    167, 3),
  ('yumurta',          'Yumurta',            'Gezen tavuk, organik köy yumurtası.',      '/images/cat-eggs.png',      54, 4),
  ('recel-pekmez',     'Reçel & Pekmez',     'Kuşburnu reçeli, dut pekmezi.',            '/images/cat-jam.png',       89, 5),
  ('yore-lezzetleri',  'Yöre Lezzetleri',    'Ceviz, kuru domates, yöresel tatlar.',     '/images/cat-regional.png', 211, 6)
on conflict (slug) do update set
  name=excluded.name, description=excluded.description, image=excluded.image,
  product_count=excluded.product_count, sort_order=excluded.sort_order;

-- ---------- vendor_profiles ----------
insert into public.vendor_profiles
  (slug, name, person, avatar, cover, location, verified, member_since, story, badges,
   units_sold, positive_pct, rating, review_count, product_count) values
  ('karadeniz-aricilik','Karadeniz Arıcılık','Yusuf Karadeniz',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
   '/images/producer-1.png','Maçka, Trabzon',true,2022,
   'Üç kuşaktır yaylada karakovan balı üretiyoruz. Arılarımızı yüksek rakımlı çiçek bahçelerinde, hiçbir katkı kullanmadan besliyoruz. Her kavanozun arkasında bir mevsimlik emek var.',
   '{"Karakovan","Gezginci Arı","Lab Analizli"}',3340,99,4.9,1340,18),
  ('merez-hatun','Merez Hatun''un Sofrası','Merez Aydın',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
   '/images/cat-dairy.png','Yüksekova, Hakkâri',true,2024,
   'Otuz yıldır Oremar yaylasında süt sağıyor, kendi ellerimle peynir ve tereyağı yapıyorum. Hayvanlarım yazın yüksek otlaklarda otluyor; bu yüzden sütümüz kokulu, peynirim bambaşka olur.',
   '{"Otlak Peyniri","El Yapımı","Kadın Üretici"}',1240,99,4.9,213,9),
  ('ege-zeytin','Ege Zeytin Bahçeleri','Ayşe Ege',
   'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
   '/images/producer-3.png','Ayvalık, Balıkesir',true,2021,
   'Aile bahçelerimizde yetişen zeytinleri erken hasatta soğuk sıkım ile işliyoruz. Topraktan şişeye kadar tüm süreç bizde; bu yüzden her damla kendi emeğimiz.',
   '{"Erken Hasat","Soğuk Sıkım","Organik"}',2890,98,4.9,1025,24),
  ('bereket-ciftligi','Bereket Çiftliği','Hasan Bereket',
   'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
   '/images/cat-eggs.png','Mengen, Bolu',true,2023,
   'Tavuklarımız gün boyu açık alanda gezer, doğal yemle beslenir. Yumurtalarımızı her sabah elle toplar, aynı gün kargoya veririz.',
   '{"Gezen Tavuk","Günlük Toplama"}',4120,98,4.9,412,6),
  ('anadolu-bahcem','Anadolu Bahçem','Fatma Demir',
   'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80',
   '/images/cat-jam.png','Gümüşhane Merkez',true,2024,
   'Bahçemizin meyvelerinden, bakır kazanda, şeker katmadan reçel ve pekmez yapıyorum. Annemden öğrendiğim tarifleri olduğu gibi sürdürüyorum.',
   '{"Katkısız","Bakır Kazan","Ev Yapımı"}',870,97,4.7,134,11),
  ('yayla-kuruyemis','Yayla Kuruyemiş','Baran Çelik',
   'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
   '/images/cat-regional.png','Kahramanmaraş Merkez',false,2026,
   'Köyümüzün asırlık ceviz ağaçlarından elle toplar, güneşte kurutuğuruz. Doğrulama belgelerimi yüklüyorum; çok yakında onaylı üretici olacağım.',
   '{"Yeni Mahsul","Elle Toplandı"}',320,96,4.7,143,7)
on conflict (slug) do update set
  name=excluded.name, person=excluded.person, avatar=excluded.avatar, cover=excluded.cover,
  location=excluded.location, verified=excluded.verified, member_since=excluded.member_since,
  story=excluded.story, badges=excluded.badges, units_sold=excluded.units_sold,
  positive_pct=excluded.positive_pct, rating=excluded.rating, review_count=excluded.review_count,
  product_count=excluded.product_count;

-- ---------- products ----------
insert into public.products
  (slug, name, category_id, vendor_id, price, old_price, unit, image, gallery, region, badge, tags, cold_chain, description, rating, review_count)
select v.slug, v.name,
       (select id from public.categories where slug = v.cat),
       (select id from public.vendor_profiles where slug = v.vend),
       v.price, v.old_price, v.unit, v.image, v.gallery, v.region, v.badge, v.tags, v.cold_chain, v.description, v.rating, v.review_count
from (values
  ('karakovan-cam-bali','Karakovan Çam Balı 850 g','bal','karadeniz-aricilik',489.9,549.9,'850 g cam kavanoz','/images/prod-honey.png','{"/images/prod-honey.png","/images/cat-honey.png"}'::text[],'Trabzon','Katkısız','{"Lab Analizli","Yüksek Rakım"}'::text[],false,'Karadeniz''in yüksek yaylalarındaki çam ormanlarından, geleneksel karakovan yöntemiyle alınan koyu, yoğun çam balı. Şeker veya glikoz katkısı yoktur; her partinin analizi paylaşılır.',4.9,326),
  ('suzme-cicek-bali','Yüksek Yayla Süzme Çiçek Balı 850 g','bal','karadeniz-aricilik',439.0,null,'850 g cam kavanoz','/images/prod-honey.png','{}'::text[],'Trabzon','Doğal','{"Süzme","Yüksek Rakım"}'::text[],false,'Yüksek rakımlı çiçeklerden süzme çiçek balı. Akışkan, berrak ve aromatik.',4.8,174),
  ('koy-tulum-peyniri','Tam Yağlı Köy Tulum Peyniri 500 g','sut-urunleri','merez-hatun',264.5,null,'500 g','/images/prod-cheese.png','{"/images/prod-cheese.png","/images/cat-dairy.png"}'::text[],'Yüksekova','Doğal','{"Otlak Sütü","Soğuk Zincir"}'::text[],true,'Yaz boyunca yüksek otlaklarda otlayan hayvanların sütünden, geleneksel yöntemle olgunlaştırılmış tam yağlı tulum peyniri. Tuz dengesi elle ayarlanır.',4.7,188),
  ('koy-tereyagi','Yayla Tereyağı 500 g','sut-urunleri','merez-hatun',359.0,399.0,'500 g','/images/prod-butter.png','{}'::text[],'Yüksekova','Katkısız','{"El Yapımı","Soğuk Zincir"}'::text[],true,'Yayıkta çalkalanmış, sarı, kokulu köy tereyağı. Kahvaltıya ve hamur işine birebir.',4.9,88),
  ('sizma-zeytinyagi','Erken Hasat Sızma Zeytinyağı 1 L','zeytin-zeytinyagi','ege-zeytin',379.0,null,'1 L cam şişe','/images/prod-oil.png','{"/images/prod-oil.png","/images/cat-olive.png"}'::text[],'Ayvalık','Organik','{"Soğuk Sıkım","Düşük Asit"}'::text[],false,'Aile bahçelerinde erken hasatta toplanan zeytinlerin soğuk sıkımıyla elde edilen, yoğun aromalı sızma zeytinyağı.',4.8,254),
  ('sele-zeytin','Salamura Sele Zeytin 1 kg','zeytin-zeytinyagi','ege-zeytin',219.0,null,'1 kg','/images/cat-olive.png','{}'::text[],'Ayvalık','Doğal','{"Doğal Salamura","Az Tuzlu"}'::text[],false,'Geleneksel yöntemle salamura edilmiş, etli ve aromatik sele zeytin.',4.7,96),
  ('gezen-tavuk-yumurtasi','Gezen Tavuk Köy Yumurtası 30 Adet','yumurta','bereket-ciftligi',159.9,179.9,'30 adet','/images/prod-eggs.png','{"/images/prod-eggs.png","/images/cat-eggs.png"}'::text[],'Bolu','Katkısız','{"Gezen Tavuk","Günlük"}'::text[],false,'Açık alanda gezen, doğal yemle beslenen tavukların yumurtaları. Her sabah elle toplanır, aynı gün gönderilir.',4.9,412),
  ('organik-koy-yumurtasi','Organik Köy Yumurtası 15 Adet','yumurta','bereket-ciftligi',94.9,null,'15 adet','/images/prod-eggs.png','{}'::text[],'Bolu','Organik','{"Organik Sertifikalı"}'::text[],false,'Organik sertifikalı yemle beslenen tavuklardan, daha küçük paket.',4.8,137),
  ('kusburnu-receli','Ev Yapımı Kuşburnu Reçeli 380 g','recel-pekmez','anadolu-bahcem',124.0,null,'380 g','/images/prod-jam.png','{"/images/prod-jam.png","/images/cat-jam.png"}'::text[],'Gümüşhane','Şeker İlavesiz','{"Ev Yapımı","Bakır Kazan"}'::text[],false,'Dağ kuşburnundan, şeker eklenmeden, bakır kazanda kaynatılarak yapılan yoğun reçel.',4.6,97),
  ('dut-pekmezi','Geleneksel Dut Pekmezi 600 g','recel-pekmez','anadolu-bahcem',149.5,169.5,'600 g','/images/prod-molasses.png','{}'::text[],'Malatya','Katkısız','{"Şeker İlavesiz","Odun Ateşi"}'::text[],false,'Beyaz duttan, odun ateşinde, katkısız kaynatılan geleneksel dut pekmezi.',4.7,121),
  ('taspaski-ceviz-ici','Taş Baskı Ceviz İçi 500 g','yore-lezzetleri','yayla-kuruyemis',219.9,null,'500 g iç','/images/prod-walnut.png','{"/images/prod-walnut.png","/images/cat-regional.png"}'::text[],'Kahramanmaraş','Doğal','{"Yeni Mahsul","Elle Toplandı"}'::text[],false,'Asırlık ağaçlardan bu yıl toplanan, güneşte kurutulup elle çıtlatılan iç ceviz. Yağı bol, içi taze.',4.8,143),
  ('gunes-kurusu-domates','Güneş Kurusu Domates 400 g','yore-lezzetleri','ege-zeytin',134.9,null,'400 g','/images/prod-tomato.png','{}'::text[],'Manisa','Organik','{"Güneşte Kurutuldu","Katkısız"}'::text[],false,'Ege güneşinde kurutulan, yoğun aromalı kuru domates. Zeytinyağıyla kavanoza birebir.',4.5,76)
) as v(slug,name,cat,vend,price,old_price,unit,image,gallery,region,badge,tags,cold_chain,description,rating,review_count)
on conflict (slug) do update set
  name=excluded.name, category_id=excluded.category_id, vendor_id=excluded.vendor_id,
  price=excluded.price, old_price=excluded.old_price, unit=excluded.unit, image=excluded.image,
  gallery=excluded.gallery, region=excluded.region, badge=excluded.badge, tags=excluded.tags,
  cold_chain=excluded.cold_chain, description=excluded.description, rating=excluded.rating,
  review_count=excluded.review_count;

-- ---------- product_reviews (ürün içi yorumlar) ----------
insert into public.product_reviews (product_id, vendor_id, author, location, rating, text, created_at)
select (select id from public.products where slug = r.pslug),
       (select vendor_id from public.products where slug = r.pslug),
       r.author, r.location, r.rating, r.text, r.created_at
from (values
  ('karakovan-cam-bali','Elif Yıldırım','İstanbul',5,'Balın tadı tam çocukluğumdaki gibi. Üreticinin hikâyesini okumak ve kimin ürettiğini bilmek çok güven veriyor.','2026-05-15'::timestamptz),
  ('karakovan-cam-bali','Mehmet T.','Ankara',5,'Kıvamı ve aroması bambaşka. Kargo takibi sorunsuzdu.','2026-04-10'::timestamptz),
  ('koy-tulum-peyniri','Zeynep Kaya','İzmir',5,'Peynir çok lezzetli ve doğal. Güvenli ödeme sayesinde içim rahat alışveriş yaptım.','2026-03-12'::timestamptz),
  ('sizma-zeytinyagi','Mehmet Demir','Ankara',5,'Zeytinyağı gerçekten erken hasat, kokusu muhteşem. İki günde elime ulaştı.','2026-04-08'::timestamptz)
) as r(pslug,author,location,rating,text,created_at)
where not exists (
  select 1 from public.product_reviews pr
  where pr.product_id = (select id from public.products where slug = r.pslug)
    and pr.author = r.author and pr.text = r.text
);
