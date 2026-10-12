"""Build 12 optional Erasmus packs, separate from the supplied 600-word PDF."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "backend/data/erasmus_vocabulary.json"
OUTPUT = ROOT / "backend/data/erasmus_extra_vocabulary.json"

# Candidate order is deliberate. PDF overlaps are skipped; each theme uses 20 new words.
THEMES = [
    ("Üniversite ve öğrenim", "admission:kabul;applicant:başvuran;enrolment:kayıt;faculty:fakülte;campus:yerleşke;lecture:ders anlatımı;seminar:seminer;curriculum:müfredat;syllabus:ders izlencesi;tuition:öğrenim ücreti;scholarship:burs;grant:hibe;transcript:not dökümü;undergraduate:lisans öğrencisi;postgraduate:lisansüstü öğrenci;exchange:değişim;placement:yerleştirme;attendance:devam durumu;deadline:son tarih;qualification:yeterlilik;thesis:tez;module:ders birimi;workshop:atölye;assessment:değerlendirme;dissertation:akademik tez"),
    ("Araştırma ve kanıt", "hypothesis:hipotez;methodology:yöntem bilimi;sample:örneklem;survey:anket;variable:değişken;correlation:korelasyon;evidence:kanıt;finding:bulgu;analysis:analiz;interpretation:yorumlama;framework:çerçeve;dataset:veri kümesi;validity:geçerlilik;reliability:güvenilirlik;observation:gözlem;citation:atıf;reference:kaynak;abstract:özet;peer:akran;replicate:tekrarlamak;inference:çıkarım;indicator:gösterge;measurement:ölçüm;pattern:örüntü;criterion:ölçüt"),
    ("Çevre ve iklim", "biodiversity:biyolojik çeşitlilik;drought:kuraklık;emission:salım;fossil:fosil;renewable:yenilenebilir;habitat:yaşam alanı;pollution:kirlilik;recycling:geri dönüşüm;sustainable:sürdürülebilir;conservation:koruma;carbon:karbon;erosion:erozyon;ecosystem:ekosistem;deforestation:ormansızlaşma;waste:atık;landfill:çöp depolama alanı;greenhouse:sera;wildlife:yaban hayatı;agriculture:tarım;scarcity:kıtlık;contamination:kirlenme;extinction:neslin tükenmesi;flood:sel;resource:kaynak;consumption:tüketim"),
    ("Sağlık ve yaşam", "allergy:alerji;anxiety:kaygı;appetite:iştah;bacteria:bakteri;diagnosis:tanı;disability:engellilik;fatigue:yorgunluk;fever:ateş;infection:enfeksiyon;nutrition:beslenme;patient:hasta;prevention:önleme;recovery:iyileşme;symptom:belirti;therapy:terapi;treatment:tedavi;vaccine:aşı;wellbeing:esenlik;immune:bağışıklıkla ilgili;chronic:kronik;mental:zihinsel;physical:fiziksel;hygiene:hijyen;medicine:ilaç;healthcare:sağlık hizmetleri"),
    ("Toplum ve kültür", "citizen:yurttaş;community:topluluk;diversity:çeşitlilik;equality:eşitlik;ethnic:etnik;generation:kuşak;identity:kimlik;immigration:göç;inequality:eşitsizlik;minority:azınlık;poverty:yoksulluk;rural:kırsal;urban:kentsel;volunteer:gönüllü;welfare:refah;heritage:miras;custom:gelenek;inclusion:kapsayıcılık;discrimination:ayrımcılık;integration:uyum;society:toplum;belief:inanç;tradition:gelenek;population:nüfus;solidarity:dayanışma"),
    ("Ekonomi ve finans", "budget:bütçe;capital:sermaye;consumer:tüketici;currency:para birimi;demand:talep;employment:istihdam;expense:gider;export:ihracat;income:gelir;inflation:enflasyon;investment:yatırım;labour:emek;market:piyasa;profit:kâr;revenue:gelir;supply:arz;tax:vergi;trade:ticaret;unemployment:işsizlik;wage:ücret;asset:varlık;debt:borç;loan:kredi;savings:birikim;productivity:verimlilik"),
    ("Teknoloji ve iletişim", "algorithm:algoritma;artificial:yapay;automation:otomasyon;bandwidth:bant genişliği;broadcast:yayın;cyber:siber;device:cihaz;encryption:şifreleme;hardware:donanım;innovation:yenilik;interface:arayüz;network:ağ;platform:platform;privacy:gizlilik;software:yazılım;transmit:iletmek;virtual:sanal;wireless:kablosuz;database:veri tabanı;upload:yüklemek;download:indirmek;storage:depolama;digital:dijital;signal:sinyal;screen:ekran"),
    ("Seyahat ve hareketlilik", "accommodation:konaklama;airline:hava yolu;arrival:varış;baggage:bagaj;border:sınır;booking:rezervasyon;destination:varış yeri;departure:ayrılış;embassy:büyükelçilik;fare:ulaşım ücreti;itinerary:seyahat planı;journey:yolculuk;luggage:valiz;passport:pasaport;reservation:rezervasyon;route:güzergâh;tourism:turizm;transport:ulaşım;visa:vize;commute:işe gidip gelmek;terminal:terminal;transfer:aktarma;customs:gümrük;abroad:yurt dışında;delay:gecikme"),
    ("İş ve kariyer", "career:kariyer;colleague:iş arkadaşı;contract:sözleşme;employer:işveren;employee:çalışan;interview:mülakat;leadership:liderlik;manager:yönetici;occupation:meslek;organization:kuruluş;profession:meslek;recruit:işe almak;responsibility:sorumluluk;skill:beceri;staff:personel;training:eğitim;internship:staj;promotion:terfi;workplace:iş yeri;salary:maaş;resignation:istifa;vacancy:açık pozisyon;supervisor:amir;teamwork:ekip çalışması;candidate:aday"),
    ("Akademik eylemler", "adapt:uyarlamak;adjust:ayarlamak;analyze:analiz etmek;compare:karşılaştırmak;compile:derlemek;define:tanımlamak;describe:betimlemek;develop:geliştirmek;distinguish:ayırt etmek;evaluate:değerlendirmek;examine:incelemek;explain:açıklamak;illustrate:örneklemek;improve:iyileştirmek;influence:etkilemek;organize:düzenlemek;publish:yayımlamak;revise:gözden geçirmek;summarize:özetlemek;verify:doğrulamak;formulate:formüle etmek;justify:gerekçelendirmek;classify:sınıflandırmak;demonstrate:göstermek;investigate:araştırmak"),
    ("Bağlaçlar ve çıkarım", "accordingly:buna göre;additionally:ayrıca;although:olmasına rağmen;apparently:görünüşe göre;consequently:sonuç olarak;despite:rağmen;furthermore:üstelik;hence:bu nedenle;however:ancak;instead:bunun yerine;likewise:benzer şekilde;moreover:dahası;nevertheless:yine de;otherwise:aksi takdirde;particularly:özellikle;whereas:oysa;therefore:bu yüzden;thus:dolayısıyla;ultimately:sonuçta;meanwhile:bu arada;nonetheless:yine de;subsequently:sonrasında;conversely:tersine;regardless:ne olursa olsun;indeed:gerçekten"),
    ("Akademik sıfatlar", "accurate:doğru;adequate:yeterli;alternative:alternatif;apparent:görünür;appropriate:uygun;aware:farkında;beneficial:yararlı;capable:yetenekli;complex:karmaşık;considerable:önemli ölçüde;crucial:çok önemli;efficient:verimli;essential:temel;evident:açık;feasible:uygulanabilir;frequent:sık;fundamental:temel;significant:önemli;specific:belirli;sufficient:yeterli;valid:geçerli;relevant:ilgili;substantial:kayda değer;potential:olası;consistent:tutarlı"),
]

SUPPLEMENTAL = [
    "registrar:öğrenci işleri görevlisi;diploma:diploma;prerequisite:ön koşul;tutorial:uygulama dersi;elective:seçmeli ders;matriculation:üniversiteye kayıt;dean:dekan;dormitory:yurt;orientation:oryantasyon;alumnus:mezun;internship:staj;credits:ders kredileri;term:dönem;enrollment:kayıt;supervisor:danışman;coursework:ders çalışmaları;mentorship:rehberlik;accreditation:akreditasyon",
    "respondent:anket katılımcısı;questionnaire:anket formu;bias:yanlılık;baseline:başlangıç düzeyi;cohort:izlenen grup;control:kontrol grubu;randomized:rastgele atanmış;longitudinal:uzun süreli;preliminary:ön;empirical:deneysel;quantitative:nicel;qualitative:nitel;statistical:istatistiksel;causality:nedensellik;replication:tekrarlama;parameter:parametre;accuracy:doğruluk;uncertainty:belirsizlik",
    "compost:organik gübre;biodegradable:biyolojik olarak çözünebilen;reforestation:yeniden ağaçlandırma;ecological:ekolojik;solar:güneş enerjili;windmill:rüzgâr değirmeni;sewage:atıksu;microplastic:mikroplastik;conserve:korumak;greenery:yeşillik;arid:kurak;desertification:çölleşme;watershed:su havzası;overfishing:aşırı avlanma;species:tür;toxic:zehirli",
    "dizziness:baş dönmesi;headache:baş ağrısı;prescription:reçete;pharmacy:eczane;dosage:doz;side-effect:yan etki;contagious:bulaşıcı;outbreak:salgın;epidemic:salgın hastalık;rehabilitation:rehabilitasyon;obesity:obezite;malnutrition:yetersiz beslenme;screening:tarama;emergency:acil durum;wellness:iyi olma hâli;sanitation:hijyen koşulları",
    "multicultural:çok kültürlü;citizenship:vatandaşlık;neighbourhood:mahalle;household:hane;belonging:aidiyet;tolerance:hoşgörü;prejudice:önyargı;stereotype:kalıp yargı;accessibility:erişilebilirlik;disparity:eşitsizlik;resettlement:yeniden yerleşim;refugee:mülteci;settlement:yerleşim;cohesion:uyum;urbanization:kentleşme;demographic:nüfusla ilgili;civic:yurttaşlıkla ilgili;norm:toplumsal kural",
    "entrepreneur:girişimci;enterprise:girişim;subsidy:sübvansiyon;deficit:açık;surplus:fazla;bankruptcy:iflas;interest:faiz;monetary:parasal;fiscal:mali;livelihood:geçim;commerce:ticaret;retail:perakende;wholesale:toptan;affordability:karşılanabilirlik;liability:yükümlülük;shareholder:hissedar;turnover:ciro;inventory:stok",
    "cybersecurity:siber güvenlik;cloud:bulut bilişim;processor:işlemci;browser:tarayıcı;firewall:güvenlik duvarı;malware:kötü amaçlı yazılım;password:parola;authentication:kimlik doğrulama;connectivity:bağlantı;deployment:dağıtıma alma;repository:kod deposu;coding:kodlama;simulation:benzetim;robotics:robotik;machine:makine;interactive:etkileşimli;digitization:sayısallaştırma",
    "check-in:giriş işlemi;boarding:biniş;gate:kapı;layover:aktarma beklemesi;stopover:ara durak;carriage:vagon;platform:peron;railway:demir yolu;shuttle:ring aracı;hostel:pansiyon;excursion:gezi;sightseeing:gezilecek yerleri görme;traveller:yolcu;aisle:koridor;one-way:tek yön;round-trip:gidiş dönüş;seaport:liman;ferry:feribot",
    "payroll:bordro;probation:deneme süresi;retirement:emeklilik;resumé:özgeçmiş;portfolio:portföy;appraisal:performans değerlendirmesi;bonus:ikramiye;shift:vardiye;overtime:fazla mesai;freelance:serbest çalışma;entrepreneurship:girişimcilik;delegate:görev devretmek;collaborate:iş birliği yapmak;mentor:rehber kişi;appointment:randevu;workload:iş yükü;contractor:sözleşmeli çalışan;recruitment:işe alım",
    "synthesize:sentezlemek;paraphrase:farklı sözlerle anlatmak;outline:ana hatlarını belirlemek;draft:taslak hazırlamak;proofread:son okuma yapmak;cite:atıfta bulunmak;attribute:kaynak göstermek;quantify:nicel olarak ölçmek;contextualize:bağlama oturtmak;elaborate:ayrıntılandırmak;differentiate:farklılaştırmak;substantiate:kanıtla desteklemek;infer:çıkarım yapmak;deduce:sonuç çıkarmak;generalize:genellemek;specify:belirtmek;refine:iyileştirmek;articulate:açık ifade etmek",
    "albeit:gerçi;inasmuch:ölçüsünde;inasmuch-as:olduğu için;notwithstanding:buna rağmen;thereby:böylece;thereafter:ondan sonra;hitherto:şimdiye dek;simultaneously:eşzamanlı;alternatively:alternatif olarak;conversely:tersine;insofar:ölçüsünde;henceforth:bundan böyle;provided:şartıyla;assuming:varsayarsak;likewise:aynı şekilde;specifically:özellikle;incidentally:yeri gelmişken;further:ayrıca",
    "plausible:makul;ambiguous:belirsiz;coherent:tutarlı;inherent:doğasında olan;explicit:açıkça belirtilmiş;implicit:örtük;prevalent:yaygın;resilient:dayanıklı;comprehensive:kapsamlı;concise:özlü;tentative:geçici;robust:güçlü;rigorous:titiz;credible:inandırıcı;objective:nesnel;subjective:öznel;notable:dikkate değer;widespread:yaygın"
]


def main():
    pdf = {word["word"].casefold() for pack in json.loads(PDF.read_text(encoding="utf-8")) for word in pack["words"]}
    used = set(pdf)
    packages = []
    for day, (theme, candidates) in enumerate(THEMES, start=31):
        candidates += ";" + SUPPLEMENTAL[day - 31]
        words = []
        for pair in candidates.split(";"):
            word, meaning = pair.split(":", 1)
            if word.casefold() in used:
                continue
            words.append({"word": word, "meaning_tr": meaning, "part_of_speech": None,
                          "exam_sections": ["V", "R"], "usage": None})
            used.add(word.casefold())
            if len(words) == 20:
                break
        if len(words) != 20:
            raise ValueError(f"{theme}: {len(words)} new words; add more candidates")
        packages.append({"day": day, "theme": theme, "words": words})
    OUTPUT.write_text(json.dumps(packages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("12 packs, 240 additional distinct words")


if __name__ == "__main__":
    main()
