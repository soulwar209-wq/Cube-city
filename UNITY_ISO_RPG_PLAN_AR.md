# خطة تنفيذ لعبة RPG ايسومترية في Unity

## الرؤية
لعبة RPG تكتيكية متناوبة الأدوار بأسلوب Pixel Art، بعالم مفتوح (شبكة 100×100) مع مستوى إخراج بصري قريب من **Sword of Convallaria** (من ناحية جودة العرض، الإضاءة، المؤثرات، والـ polish).

> ملاحظة إنتاجية: الوصول لنفس مستوى لعبة تجارية كبيرة يتطلب فريقًا (Art + Tech + Design) ومدة تطوير طويلة. هذه الخطة تهدف للوصول إلى نتيجة قريبة بأسلوب احترافي تدريجي.

---

## 1) المواصفات الأساسية (MVP)

- **المحرك**: Unity 2022/2023 LTS
- **النمط**: Isometric 2.5D (Tiles + Characters)
- **العالم**: 100×100 خلية (10,000 Tile)
- **النوع**: RPG + Turn-based Tactical Combat
- **الأسلوب الفني**: Pixel Art عالي الجودة
- **الكاميرا**: Isometric ثابتة مع Pan/Zoom محدود
- **المعركة**:
  - نظام أدوار (Player Turn / Enemy Turn)
  - نقاط حركة AP
  - مدى هجوم/مهارات
  - تأثير الارتفاع/التغطية (Cover) لاحقًا

---

## 2) البنية التقنية المقترحة

### المشاهد (Scenes)
1. `Bootstrap` (تحميل الخدمات والأنظمة)
2. `WorldMap` (الاستكشاف في العالم المفتوح)
3. `BattleScene` (القتال التكتيكي)
4. `UI_Overlay` (قوائم، Inventory، Stats)

### الطبقات (Systems)
- **Grid System**: إدارة الشبكة 100×100
- **Tile System**: نوع الخلية (أرض/ماء/عائق/ارتفاع)
- **Navigation**: A* pathfinding على الشبكة
- **Turn System**: ترتيب الأدوار + AP
- **Combat System**: ضرر/دقة/نِسب/حالات
- **AI System**: اختيار هدف + تموضع + استخدام مهارات
- **Data-driven**: ScriptableObjects (Skills, Units, Items, Enemies)
- **Save/Load**: JSON أو Binary

---

## 3) مكوّنات Unity الضرورية

- **URP 2D Renderer**
- **2D Pixel Perfect Camera**
- **Cinemachine**
- **Input System**
- **Addressables** (للأصول الكبيرة لاحقًا)
- **TextMeshPro**

اختياري:
- **A* Pathfinding Project** أو NavGrid مخصص
- **Odin Inspector** (لتسريع أدوات التطوير)

---

## 4) تحويل الإحداثيات (Grid ↔ Isometric)

لشبكة Isometric قياسية:

- من Grid إلى World:
  - `worldX = (gridX - gridY) * (tileWidth / 2)`
  - `worldY = (gridX + gridY) * (tileHeight / 2)`

- من World إلى Grid (تقريب):
  - `gridX = (worldX / (tileWidth/2) + worldY / (tileHeight/2)) / 2`
  - `gridY = (worldY / (tileHeight/2) - worldX / (tileWidth/2)) / 2`

> استخدم Sorting Layers + Y-sort لضمان ترتيب الرسم الصحيح.

---

## 5) تصميم نظام القتال المتناوب (على نمط تكتيكي)

### دورة الدور
1. Start Turn
2. استرجاع AP/تأثيرات الحالة
3. اختيار حركة أو مهارة
4. تنفيذ الحركة (Path + تكلفة)
5. تنفيذ فعل (هجوم/مهارة/عنصر)
6. End Turn

### قواعد مقترحة
- كل وحدة لديها:
  - HP, MP, AP, MoveRange, AttackRange, Speed
- AP مثال:
  - حركة خلية = 1 AP
  - هجوم عادي = 2 AP
  - مهارة = 3~5 AP
- Crit/Hit:
  - `HitChance = Accuracy - TargetEvasion + HeightBonus`

### الذكاء الاصطناعي
- تقييم كل خانة حسب:
  - قرب الهدف
  - الحماية
  - إمكانية قتل الهدف
- اختيار أفضل Action عبر Scoring Function

---

## 6) العالم المفتوح 100×100

- **تقسيم العالم إلى Chunks** (مثلاً 20×20)
- تحميل/تفريغ chunks ديناميكيًا
- حفظ حالة كل chunk:
  - الأعداء
  - الصناديق
  - الأحداث
- تجنب رسم 10,000 Tile دفعة واحدة إذا امتلأت بتفاصيل عالية

---

## 7) أسلوب Pixel Art قريب من Sword of Convallaria

### عناصر الجودة البصرية
- دقة بكسل ثابتة (مثلاً 32px أو 48px لكل Tile)
- Palettes متناسقة (بيئة/شخصيات/FX)
- Rim light خفيف على الشخصيات
- ظلال ناعمة + Ambient Occlusion بسيط
- مؤثرات سحر/ضربات بإطارات FX واضحة
- Idle/Attack/Hurt/Death Animation ناعمة
- UI نظيف مع إطار فني متناسق

### Pipeline فني
1. Concept sheets
2. Tile-set production
3. Character sprite sheets
4. VFX sprite atlases
5. UI atlas

---

## 8) خارطة طريق تنفيذ (12 أسبوع)

### المرحلة 1 (أسبوع 1-2)
- إعداد Unity project + URP + Pixel Perfect
- بناء Grid Isometric
- كاميرا وتحكم لاعب على الخريطة

### المرحلة 2 (أسبوع 3-4)
- Pathfinding A*
- نظام Turn Manager
- حركة تكتيكية بنقاط AP

### المرحلة 3 (أسبوع 5-6)
- هجوم عادي + مهارتين
- نظام الضرر والحالات
- واجهة أدوار/مهارات

### المرحلة 4 (أسبوع 7-8)
- AI تكتيكي (MVP)
- Battle flow كامل (Victory/Defeat)

### المرحلة 5 (أسبوع 9-10)
- World chunks + أحداث + NPCs
- Quest بسيط + Inventory

### المرحلة 6 (أسبوع 11-12)
- تحسينات بصرية وصوتية
- موازنة القتال
- إصلاحات + Build تجريبي

---

## 9) هيكل مجلدات Unity مقترح

```
Assets/
  _Project/
    Art/
      Tiles/
      Characters/
      VFX/
      UI/
    Audio/
    Prefabs/
      World/
      Units/
      UI/
    Scenes/
      Bootstrap.unity
      WorldMap.unity
      BattleScene.unity
    Scripts/
      Core/
      Grid/
      Combat/
      AI/
      UI/
      Data/
    ScriptableObjects/
      Units/
      Skills/
      Items/
```

---

## 10) الخطوة التالية العملية

لبدء التنفيذ مباشرة:
1. أنشئ مشروع Unity URP (2D).
2. فعّل Pixel Perfect + Input System.
3. أنشئ مشهد `WorldMap` مع Grid Isometric 100×100.
4. سأعطيك بعدها سكربتات جاهزة للآتي:
   - `IsoGridManager.cs`
   - `UnitController.cs`
   - `TurnManager.cs`
   - `PathfinderAStar.cs`
   - `BattleController.cs`

---


## 11) تخصيص المشروع لمنصة Android (مهم)

بما أنك تستهدف **Android**، نعدل الأولويات التقنية من البداية:

- **التحكم**: Touch-first UI (نقر للحركة/الهجوم) بدل الاعتماد على الكيبورد.
- **واجهة القتال**: أزرار كبيرة وواضحة (AP، End Turn، Skills) مع دعم الشاشات الصغيرة.
- **الأداء**: استهداف 30~60 FPS على أجهزة متوسطة عبر:
  - Sprite Atlases
  - تقليل Overdraw
  - تقليل المؤثرات الثقيلة في نفس اللحظة
- **الذاكرة**:
  - ضغط الخامات (ASTC)
  - تحميل الأصول تدريجيًا باستخدام Addressables
- **الدقة**:
  - مرجع دقة 1080x1920 (Portrait) أو 1920x1080 (Landscape) حسب قرارك
  - الحفاظ على Pixel Perfect بدون تشويش

### إعدادات Build مقترحة
- Platform: Android
- Scripting Backend: IL2CPP
- Architecture: ARM64 (مع ARMv7 عند الحاجة)
- Texture Compression: ASTC
- Min SDK: حسب جمهورك (غالبًا Android 8+ كبداية عملية)

### تعديلات Gameplay للّمس
- نقرة واحدة = تحديد وحدة/هدف
- نقرة ثانية = تأكيد الحركة أو تنفيذ الهجوم
- ضغط مطول = معلومات الوحدة (HP/AP/Status)
- سحب بإصبعين = تحريك الكاميرا
- Pinch = Zoom

---

## 12) الخطوة التالية العملية (نسخة Android)

1. افتح Unity Hub وأنشئ مشروع URP 2D جديد.
2. فعّل Android Build Support من Unity Hub (SDK/NDK/OpenJDK).
3. أنشئ مشهد Isometric Grid بحجم 100×100 مع Chunking مبكر.
4. ابدأ بنظام Touch Input بدل Keyboard Input.
5. بعد ذلك أبني معك أول Prototype قابل للتشغيل على هاتف Android.

