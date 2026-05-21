# دليل إنتاج أصول اللعبة (Game Assets) — مشروع RPG إيزومتري على Unity/Android

هذا الملف يحول كل المتطلبات السابقة إلى **حزمة تنفيذية كاملة** قابلة للإضافة مباشرة داخل المشروع.

---

## 1) نطاق الأصول المطلوبة (Complete Scope)

## 1.1 شخصيات قابلة للعب (5)
1. Knight
2. Mage
3. Archer
4. Lancer
5. Shieldbearer

لكل شخصية لاعب:
- Sprite Sheet جسم (Idle/Walk/Attack/Skill/Hit/Death)
- Sprite Sheet سلاح (Layer مستقل)
- Portrait للـ UI
- أيقونات 4 مهارات
- VFX خاص للمهارات

## 1.2 الأعداء
- Grunt Swordsman
- Spear Raider
- Dark Archer
- Cult Mage
- Shield Brute
- Assassin Shade
- Beast Wolf
- Boss: Warden of Ash (3 Phases)

لكل عدو:
- Sprite Sheet (Idle/Walk/Attack/Hit/Death)
- أيقونتا مهارة على الأقل
- VFX ضربات/مهارات

## 1.3 البيئة (Isometric Tiles)
- أرضيات: Grass / Dirt / Stone / Sand
- حواف انتقالات (Transitions)
- جدران ومنحدرات
- عناصر ديكور: أشجار/صخور/مصابيح/براميل/صناديق
- عناصر تفاعلية: أبواب/Lever/Chest

## 1.4 واجهات المستخدم
- إطار HUD
- Action Bar
- HP/AP Bars
- Skill Buttons
- Buff/Debuff Icons
- نافذة معلومات الوحدة
- نافذة الدور الحالي

## 1.5 الصوتيات
- BGM (Town/Battle/Boss)
- SFX (Slash/Arrow/Magic/Hit/UI Click)
- Voice snippets اختيارية

---

## 2) مواصفات فنية ثابتة (Production Specs)

- **Tile Base**: 48x24 (Isometric Diamond)
- **Character Frame**: 96x96
- **PPU**: 48
- **Animation FPS**: 12
- **Color Depth**: 32-bit PNG (مع شفافية)
- **Import Filter**: Point (no filter)
- **Compression (Android)**: ASTC
- **Atlas Size**: 2048 كبداية

---

## 3) هيكل مجلدات الأصول (جاهز للإضافة)

```
Assets/_Project/Art/
  Characters/
    Knight/
      Sprites/
      Portrait/
      Icons/
      VFX/
    Mage/
    Archer/
    Lancer/
    Shieldbearer/
  Enemies/
    GruntSwordsman/
    SpearRaider/
    DarkArcher/
    CultMage/
    ShieldBrute/
    AssassinShade/
    BeastWolf/
    WardenOfAsh/
  Tiles/
    Biomes/
      Grassland/
      Ruins/
      Volcanic/
    Props/
  UI/
    HUD/
    Icons/
    Panels/
  VFX/
    Combat/
    Magic/
    Status/
Assets/_Project/Audio/
  BGM/
  SFX/
```

---

## 4) Naming Convention (إجباري لتفادي الفوضى)

## 4.1 الشخصيات
- `CHR_<Class>_<Action>_<Dir>_<Frame>.png`
- مثال: `CHR_Knight_Walk_NE_03.png`

## 4.2 الأعداء
- `ENM_<Type>_<Action>_<Dir>_<Frame>.png`
- مثال: `ENM_DarkArcher_Attack_SW_05.png`

## 4.3 المهارات
- `SKL_<Owner>_<SkillName>_<Phase>_<Frame>.png`
- مثال: `SKL_Mage_MeteorSigil_Impact_07.png`

## 4.4 الواجهة
- `UI_<PanelOrIcon>_<State>.png`
- مثال: `UI_SkillBtn_Pressed.png`

---

## 5) قائمة الأنيميشن لكل وحدة

الحد الأدنى لكل Character/Enemy:
- Idle (8)
- Walk (8)
- Attack (10)
- Cast/Skill (12)
- Hit (4)
- Death (10)

للمهارات Ultimate:
- Cast Start (4)
- Charge Loop (4~8)
- Release (6)
- Impact (6)

---

## 6) قائمة إنتاج المهارات (Playable 5x4)

## Knight
- Slash Arc
- Guard Break
- Valiant Charge
- Lion Oath

## Mage
- Arcane Bolt
- Frost Ring
- Chain Spark
- Meteor Sigil

## Archer
- Piercing Shot
- Rain of Arrows
- Evasive Step
- Falcon Eye

## Lancer
- Long Thrust
- Sweep Pole
- Brace
- Dragon Lance

## Shieldbearer
- Shield Bash
- Guardian Wall
- Taunt Roar
- Aegis Domain

> المجموع: 20 مهارة لاعب + مهارات الأعداء + 3 مراحل للـ Boss.

---

## 7) إعدادات Unity Import لكل نوع أصل

## Sprites (Characters/Enemies)
- Texture Type: Sprite (2D and UI)
- Sprite Mode: Multiple
- Pixels Per Unit: 48
- Filter Mode: Point
- Compression: None أثناء الإنتاج / ASTC في Android Build

## UI
- Compression خفيف مع الحفاظ على وضوح الخطوط
- استخدام Sprite Atlas منفصل للـ UI

## Audio
- BGM: Vorbis (Quality 0.5~0.7)
- SFX: PCM/ADPCM حسب الاستخدام
- Preload AudioData للـ UI SFX

---

## 8) ملف تسليم لكل شخصية (Definition of Done)

تُعتبر الشخصية مكتملة عندما تحتوي على:
- جميع حالات الأنيميشن الأساسية
- 4 مهارات مع FX
- Portrait + 4 Skill Icons
- Animator Controller + Avatar Mask إن لزم
- ربطها في `UnitData` و`SkillData`
- اختبار داخل مشهد BattleScene بدون أخطاء

---

## 9) Backlog إنتاج الأعداء

## Tier 1 (MVP)
- Grunt Swordsman
- Dark Archer
- Cult Mage

## Tier 2
- Spear Raider
- Shield Brute
- Beast Wolf

## Tier 3
- Assassin Shade
- Boss Warden of Ash

---

## 10) خطة تنفيذ سريعة (4 مراحل)

1. **Foundation**: إعداد Tiles + Knight + Grunt
2. **Core Combat Look**: Mage + Archer + مؤثرات أساسية
3. **Class Completion**: Lancer + Shieldbearer + بقية الأعداء
4. **Boss & Polish**: Warden of Ash + UI polish + تحسين الأداء Android

---

## 11) أصول بديلة مؤقتة (Prototype Fallback)

إذا لم تكن الرسومات الأصلية جاهزة:
- استخدم Placeholder sprites بنفس الأبعاد
- ثبت أسماء الملفات النهائية من الآن
- لا تغيّر نظام الأنيميشن عند استبدال الرسوم

---

## 12) المطلوب إضافته فعليًا للمشروع الآن

- هذا الملف كمرجع إنتاج رئيسي.
- إنشاء هيكل مجلدات الأصول المذكور.
- إنشاء ملفات `.gitkeep` داخل المجلدات الفارغة لتثبيت البنية في Git.

