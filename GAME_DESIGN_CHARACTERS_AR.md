# تصميم الشخصيات والمهارات والأنيميشن

هذا المستند يقدم تصميمًا جاهزًا للإنتاج لـ **5 شخصيات لاعبين** + **مجموعة أعداء متعددة** مع مهارات وأنيميشن وهوية بصرية مميزة لكل وحدة، مناسب للعبة RPG تكتيكية إيزومترية بنمط Pixel Art على Android.

---

## 1) شخصيات اللاعب (5 Classes)

## A) الفارس (Knight)

**الدور:** Frontline Bruiser (ضرر + صمود متوسط)

**الهوية البصرية:**
- درع فولاذي أزرق داكن مع خطوط ذهبية
- سيف طويل بعلامة رونية خافتة
- وشاح خلفي قصير يتحرك في الحركة

**الإحصائيات الأساسية:**
- HP: مرتفع
- AP: متوسط
- Move: 4 خلايا
- Attack Range: 1
- Defense: مرتفع

**المهارات:**
1. **Slash Arc** (2 AP) – ضربة قوسية أمامية (خلية/خليتين).
2. **Guard Break** (3 AP) – ضربة تخفض دفاع الهدف 2 أدوار.
3. **Valiant Charge** (4 AP) – اندفاع حتى 3 خلايا + ضرر عند الاصطدام.
4. **Ultimate: Lion Oath** (5 AP) – زيادة دفاع وCounter لمدة دورين.

**أنيميشن المطلوبة:**
- Idle (8 فريم)
- Walk (8 فريم)
- Basic Attack (10 فريم)
- Skill Cast x3 (12-16 فريم لكل مهارة)
- Hit (4 فريم)
- Death (10 فريم)

---

## B) الساحر (Mage)

**الدور:** AoE Burst + Control

**الهوية البصرية:**
- رداء بنفسجي/فيروزي بطبقات
- عصا بلّورة عائمة فوق القمة
- جسيمات سحر خفيفة حول اليدين

**الإحصائيات الأساسية:**
- HP: منخفض
- AP: مرتفع
- Move: 4
- Attack Range: 4
- Magic: مرتفع جدًا

**المهارات:**
1. **Arcane Bolt** (2 AP) – مقذوف سحري بعيد المدى.
2. **Frost Ring** (3 AP) – ضرر دائري + Slow.
3. **Chain Spark** (4 AP) – برق ينتقل بين 3 أهداف.
4. **Ultimate: Meteor Sigil** (5 AP) – AoE كبير بعد تأخير نصف ثانية.

**أنيميشن المطلوبة:**
- Idle (8)
- Walk (8)
- Staff Attack (10)
- Cast Start / Cast Loop / Cast End
- Skill FX timelines منفصلة لكل مهارة
- Hit / Death

---

## C) رامي السهام (Archer)

**الدور:** Single-target DPS + Positioning

**الهوية البصرية:**
- رداء أخضر غامق + جلد بني
- قوس مركب بتوهج خفيف عند الشد
- كنانة أسهم متنوعة الرأس

**الإحصائيات الأساسية:**
- HP: منخفض-متوسط
- AP: متوسط
- Move: 5
- Attack Range: 5
- Crit: مرتفع

**المهارات:**
1. **Piercing Shot** (2 AP) – سهم يخترق هدفين بخط مستقيم.
2. **Rain of Arrows** (4 AP) – AoE مخروطي.
3. **Evasive Step** (2 AP) – تراجع خلية + زيادة Evasion.
4. **Ultimate: Falcon Eye** (5 AP) – مدى + Crit + رؤية أكبر لدورين.

**أنيميشن المطلوبة:**
- Draw/Release layers دقيقة
- Idle/Walk
- Quick Shot / Charged Shot
- Skill-specific bow glow FX
- Hit/Death

---

## D) حامل الرمح (Lancer)

**الدور:** Reach Control + Anti-Charge

**الهوية البصرية:**
- درع خفيف أحمر/رمادي
- رمح طويل مع راية صغيرة
- قفازات معدنية مدعّمة

**الإحصائيات الأساسية:**
- HP: متوسط
- AP: متوسط
- Move: 5
- Attack Range: 2
- Counter: جيد

**المهارات:**
1. **Long Thrust** (2 AP) – طعنة بمدى 2.
2. **Sweep Pole** (3 AP) – ضربة محيطية تدفع الخصوم خلية.
3. **Brace** (2 AP) – وضعية صد ضد الاندفاعات.
4. **Ultimate: Dragon Lance** (5 AP) – خط هجوم قوي + نزيف.

**أنيميشن المطلوبة:**
- Pole handling واضح
- Attack variations (thrust/sweep)
- Brace stance hold
- Hit/Death

---

## E) حامل الدرع (Shieldbearer)

**الدور:** Tank + Protection

**الهوية البصرية:**
- درع برج ضخم بنقش أسد
- سلاح ثانوي قصير (mace)
- جسم أثقل وخطوات قوية

**الإحصائيات الأساسية:**
- HP: الأعلى
- AP: منخفض-متوسط
- Move: 3
- Attack Range: 1
- Block: الأعلى

**المهارات:**
1. **Shield Bash** (2 AP) – ضرر + Stun قصير.
2. **Guardian Wall** (3 AP) – يخلق منطقة حماية 2x2.
3. **Taunt Roar** (3 AP) – إجبار الأعداء القريبين على استهدافه.
4. **Ultimate: Aegis Domain** (5 AP) – تقليل ضرر للفريق حوله.

**أنيميشن المطلوبة:**
- Heavy idle/walk
- Shield-up stance
- Bash impact frames قوية
- Hit/Death

---

## 2) الأعداء (متعددون بمهارات مختلفة)

## 2.1 Grunt Swordsman
- عدو قريب المدى أساسي
- مهارات: Quick Slash / Aggro Shout
- دور: ضغط مبكر

## 2.2 Spear Raider
- مدى 2 + Counter
- مهارات: Thrust / Hook Pull
- دور: سحب اللاعب من مواقع آمنة

## 2.3 Dark Archer
- مدى بعيد
- مهارات: Poison Arrow / Volley
- دور: استنزاف خلفي

## 2.4 Cult Mage
- ساحر ضرر جماعي
- مهارات: Dark Orb / Hex Field
- دور: Area denial

## 2.5 Shield Brute
- دبابة للأعداء
- مهارات: Guard / Body Block
- دور: حماية وحدات الخلف

## 2.6 Assassin Shade
- سريع جدًا
- مهارات: Shadow Step / Backstab
- دور: اغتيال وحدات هشة

## 2.7 Beast Wolf
- وحش سريع
- مهارات: Leap Bite / Pack Howl
- دور: Flank

## 2.8 Boss: Warden of Ash
- زعيم متعدد المراحل
- Phase 1: Melee + Armor Up
- Phase 2: Flame Line + Summon Imps
- Phase 3: Enrage + AoE Smash

---

## 3) أنيميشن موحدة لكل الشخصيات

لكل شخصية (لاعب/عدو):
- Idle
- Walk
- Turn Left/Right (اختياري حسب النظام)
- Attack A
- Attack B/Skill
- Cast
- Hit React
- Knockdown (اختياري)
- Death

**توصية فنية:**
- 8 اتجاهات للحركة (NE, NW, SE, SW + الفرعية) أو 4 اتجاهات إذا الميزانية أقل.
- 8~12 فريم للحركات الأساسية.
- 12~20 فريم للمهارات الـ Ultimate.

---

## 4) تصميم مميز لكل شخصية (Style Guide سريع)

- **Silhouette أولاً:** كل Class يجب أن تُعرف من شكلها فقط.
- **Color Identity:**
  - Knight: أزرق/ذهبي
  - Mage: بنفسجي/فيروزي
  - Archer: أخضر/بني
  - Lancer: أحمر/رمادي
  - Shieldbearer: رمادي داكن/نحاسي
- **Weapon Readability:** السلاح واضح من أول نظرة.
- **FX Language:**
  - السحر = خطوط ناعمة وجسيمات
  - الضربات المادية = ومضات حادة + شظايا

---

## 5) تكامل Unity (تنفيذي)

## ScriptableObjects
- `UnitData` (الاحصائيات الأساسية)
- `SkillData` (المدى، AP، الضرر، التأثيرات)
- `AnimationSetData` (مراجع الـ clips لكل حالة)
- `VFXData` (prefabs + timings)

## Animator States
- Base Layer: Idle/Walk/Hit/Death
- Action Layer: Attack/Cast
- Override Controller لكل Class

## Combat Hooks
- OnSkillStart -> Spawn Cast FX
- OnImpactFrame -> Apply Damage/Status
- OnSkillEnd -> Return to Idle

---

## 6) إنتاج الأصول (Asset Checklist)

لكل **Class لاعب**:
- Sprite Sheet Body
- Sprite Sheet Weapon
- Skill FX Atlas
- Portrait (UI)
- Icon set (skills)

لكل **Enemy**:
- Sprite Sheet
- 2 مهارات على الأقل
- Hit/Death animations

للـ **Boss**:
- 3 مجموعات مهارات (Phase-based)
- مؤثرات انتقال بين المراحل
- UI خاص (Boss HP Bar + phase indicator)

---

## 7) أولوية التنفيذ (Sprint مقترح)

### Sprint 1
- Knight + Grunt + نظام أنيميشن أساسي

### Sprint 2
- Mage + Archer + Dark Archer + Cult Mage

### Sprint 3
- Lancer + Shieldbearer + Shield Brute + Assassin Shade

### Sprint 4
- Boss Warden of Ash + تحسينات VFX/SFX + موازنة

