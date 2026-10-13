// Long-form teaching content for the shared Grammar library. Daily Erasmus notes
// remain short because they serve as a recap after the video.
export const grammarLessons = {
  "present-simple": {
    intro: "Present Simple; düzenli yapılan işleri, kalıcı durumları ve genel doğruları anlatır. Cümlenin zamanı genellikle bir alışkanlık ifadesinden veya bağlamdan anlaşılır.",
    sections: [
      ["Ne zaman kullanılır?", "Every day, usually, often, sometimes ve never gibi ifadeler tekrar eden davranışları gösterir. Genel doğrular ve kalıcı durumlar da bu zamanla anlatılır. Bir eylem tam şu anda gerçekleşiyor diye Present Simple seçilmez.", "I study English every evening. · Water boils at 100°C. · She lives in Manisa."],
      ["Olumlu cümle", "I/you/we/they ile fiilin yalın hâli kullanılır. He/she/it ile fiile çoğunlukla -s eklenir; -sh, -ch, -x, -o ile bitenlerde -es, sessiz harf + y ile bitenlerde y → ies olur. Have fiili üçüncü tekilde has olur.", "They work on Fridays. · He watches lessons online. · She studies every day."],
      ["Olumsuz ve soru", "I/you/we/they için do not (don't), he/she/it için does not (doesn't) gelir. Soru Do/Does + özne + yalın fiil ile kurulur. Does veya doesn't kullanıldığında ana fiile bir daha -s eklenmez.", "She doesn't study on Sundays. · Does he speak English? · Where do they live?"],
      ["Be fiili ve sıklık zarfları", "Be fiili için do/does kullanılmaz: am/is/are doğrudan çekimlenir. Sıklık zarfı normal fiilden önce, be fiilinden sonra gelir. 'I usually am...' yerine doğal sıra 'I am usually...' şeklindedir.", "He is usually early. · We often read articles. · Are they ready?"],
    ],
    summary: ["Alışkanlık, kalıcı durum, genel doğru → Present Simple.", "He/she/it olumlu cümlede -s/-es; does ile ana fiil yalın.", "Be fiili kendi başına soru ve olumsuz kurar."],
  },
  "present-continuous": {
    intro: "Present Continuous, konuşma anında süren veya geçici olarak devam eden durumları anlatır. Temel yapı am/is/are + fiil-ing biçimindedir.",
    sections: [
      ["Şu an ve geçici dönem", "Now, right now, at the moment konuşma anını işaret eder. These days ve this week gibi ifadeler ise o saniyede olmasa da geçici bir dönemde devam eden işleri anlatabilir.", "She is watching the lesson now. · I am preparing for the exam this week."],
      ["Yapı ve yazım", "Öznenin ardından am/is/are gelir; fiil -ing alır. Olumsuzda not eklenir, soruda am/is/are başa geçer. Son sessiz harfin çiftlenmesi (run → running) ve son e'nin düşmesi (write → writing) gibi yazım kurallarına dikkat edilir.", "They are studying. · He isn't sleeping. · Are you listening?"],
      ["Planlanmış gelecek", "Yakın gelecekte düzenlenmiş kişisel planlar da Present Continuous ile anlatılabilir. Gelecek anlamı için zaman ifadesi veya açık bağlam gerekir.", "We are meeting our teacher tomorrow. · She is flying on Friday."],
      ["Durum fiilleri", "Know, believe, understand, own gibi fiiller durum bildirdiğinde genellikle continuous almaz. Bazı fiiller anlam değiştirir: 'I think' görüş, 'I am thinking' ise düşünme sürecidir.", "I know the answer. · I am thinking about the answer."],
    ],
    summary: ["Şu an veya geçici dönem → am/is/are + -ing.", "Olumsuz: am/is/are + not; soru: Am/Is/Are + özne.", "Know gibi durum fiilleri çoğunlukla simple kullanır."],
  },
  "past-simple": {
    intro: "Past Simple, geçmişte başlayıp bitmiş olayları anlatır. Yesterday, last week, ago veya belirli bir geçmiş yıl çoğu zaman güçlü ipucudur.",
    sections: [
      ["Tamamlanmış geçmiş", "Olayın şimdi sürmesi gerekmez; anlatılan zaman geçmişte kapanmıştır. Bir öyküde art arda gelen olaylar da Past Simple ile verilir.", "I submitted the form yesterday. · She entered the room and sat down."],
      ["Olumlu biçim", "Düzenli fiiller -ed alır; düzensiz fiillerin ikinci hâli öğrenilir. Write → wrote, go → went, see → saw gibi biçimler -ed ile türetilemez. Be fiili was/were olur.", "We visited the campus. · He wrote an email. · They were late."],
      ["Olumsuz ve soru", "Did not/didn't ve Did ile ana fiil yeniden yalın hâle döner. 'Did she went?' veya 'didn't studied' yanlıştır. Be fiili did kullanmadan was/were ile soru ve olumsuz kurar.", "She didn't go. · Did you read the text? · Were they at home?"],
      ["Past Simple ve Present Perfect", "Yesterday ya da in 2020 gibi bitmiş zaman belirten bir cümlede Past Simple gerekir. Present Perfect daha çok zaman belirtilmediğinde veya sonucun şimdiyle ilişkisi vurgulandığında kullanılır.", "I saw that film last night. · I have seen that film before."],
    ],
    summary: ["Bitmiş geçmiş → V2 / -ed.", "Did/didn't sonrasında ana fiil yalın.", "Kesin bitmiş zaman ifadesi varsa genellikle Past Simple."],
  },
  "past-continuous": {
    intro: "Past Continuous, geçmişte belirli bir anda sürmekte olan eylemi gösterir. Yapı was/were + fiil-ing biçimindedir.",
    sections: [
      ["Geçmişteki süreç", "Bu zaman eylemin bitişini değil, o anda devam ettiğini gösterir. 'At 8 p.m. yesterday' gibi zaman noktalarıyla sık kullanılır.", "At eight, I was reading. · They were studying all evening."],
      ["Bir olayın araya girmesi", "Uzun süren arka plan eylemi Past Continuous, onu bölen kısa olay genellikle Past Simple olur. When kısa olayı, while süren eylemi tanıtabilir; yine de seçimi bağlam belirler.", "I was reading when the phone rang. · While we were walking, it started to rain."],
      ["Aynı anda süren eylemler", "İki olay geçmişte aynı anda devam ediyorsa ikisi de Past Continuous olabilir. Bu yapı tek seferlik tamamlanmış olayların sırasını anlatmak için uygun değildir.", "She was taking notes while he was explaining the rule."],
      ["Olumsuz, soru ve yaygın hata", "Olumsuzda was/were + not, soruda Was/Were + özne + -ing kullanılır. 'Did you were studying?' iki yardımcı fiili yanlış birleştirir.", "I wasn't sleeping. · Were you listening when she called?"],
    ],
    summary: ["Geçmişte süren süreç → was/were + -ing.", "Araya giren kısa olay genellikle Past Simple.", "Soru Was/Were ile başlar; did eklenmez."],
  },
  "present-perfect": {
    intro: "Present Perfect, geçmişteki bir olayla şimdiki durum arasında bağ kurar. Yapı have/has + fiilin üçüncü hâlidir (V3).",
    sections: [
      ["Deneyim ve sonuç", "Hayat deneyiminde olayın tam zamanı söylenmez: 'I have visited London.' Şimdiki sonucu önemliyse de aynı yapı kullanılır: 'She has lost her key' yani anahtar şu an yoktur.", "Have you ever taken a language exam? · I have finished my homework."],
      ["Since, for ve devam eden durum", "Since başlangıç noktasını, for süreyi belirtir. Devam eden durumlarda 'have lived' gibi yapı geçmişte başlar ve şimdiye uzanır. Ago ise bitmiş geçmişle kullanılır.", "I have lived here since 2022. · She has studied for three hours."],
      ["Already, yet, just", "Already beklenenden önce gerçekleşmeyi, yet çoğunlukla soru/olumsuzda henüz anlamını, just ise çok yakın geçmişi anlatır. Zarfın cümledeki konumuna dikkat edilir.", "I have already applied. · Have they replied yet? · He has just arrived."],
      ["Past Simple ile sınır", "Yesterday, last Monday, in 2020 gibi tamamlanmış zaman ifadeleriyle normalde Past Simple kullanılır. Present Perfect'te kesin geçmiş zamanı belirtmeden deneyim veya güncel sonuç anlatılır.", "I sent it yesterday. · I have sent it, so you can read it now."],
    ],
    summary: ["Şimdiyle ilişkili geçmiş → have/has + V3.", "Since başlangıç; for süre.", "Yesterday gibi bitmiş zaman → Past Simple."],
  },
  "past-perfect": {
    intro: "Past Perfect, geçmişteki iki olayın daha önce gerçekleşenini açıkça gösterir. Yapı had + V3 biçimindedir.",
    sections: [
      ["Olayların sırası", "Anlatım noktası zaten geçmişteyse, ondan da önce biten olay Past Perfect alabilir. Sonraki olay çoğunlukla Past Simple olur. Ama sıra before/after ile zaten açıksa iki Past Simple da bazen mümkündür.", "The train had left before we arrived. · When I got home, she had gone out."],
      ["Olumsuz ve soru", "Had bütün öznelerle aynıdır. Olumsuz had not/hadn't + V3, soru Had + özne + V3 biçimindedir. Did ile birlikte kullanılmaz.", "They hadn't finished the task. · Had you seen the email before the meeting?"],
      ["By the time ve already", "By the time bir geçmiş olayı referans noktası yapar. O noktaya kadar tamamlanan eylem Past Perfect ile vurgulanabilir. Already çoğu kez daha önce tamamlanmışlığı güçlendirir.", "By the time the lecture began, we had found our seats."],
      ["Past Perfect ne zaman gereksiz?", "Tek bir geçmiş olay anlatılıyorsa Past Simple yeterlidir. Her geçmiş cümleyi had + V3 yapmak anlamı gereksiz yere değiştirir; iki geçmiş nokta arasındaki önceliği arayın.", "I visited the library yesterday. · I had visited it before the course started."],
    ],
    summary: ["Geçmişten daha önceki geçmiş → had + V3.", "Sonraki olay çoğunlukla Past Simple.", "Tek geçmiş olay için otomatik olarak Past Perfect seçme."],
  },
  "future": {
    intro: "İngilizcede gelecek için tek bir zaman yoktur. Will, be going to ve Present Continuous farklı karar ve plan türlerini öne çıkarır.",
    sections: [
      ["Will", "Konuşma anında verilen karar, teklif, söz veya elde belirgin kanıt olmadan yapılan tahmin için yaygındır. Will tüm öznelerle aynıdır; ardından yalın fiil gelir.", "I'll answer the phone. · I think the exam will be difficult."],
      ["Be going to", "Önceden verilmiş niyet/plan veya şimdi görülen kanıta dayalı tahmin için kullanılır. Am/is/are + going to + yalın fiil biçimindedir.", "I'm going to revise tonight. · Look at those clouds; it's going to rain."],
      ["Present Continuous ve çizelge", "Saati/tarihi belirlenmiş kişisel düzenlemelerde Present Continuous doğaldır. Resmî program ve tarifelerde bazen Present Simple kullanılır.", "We are meeting the tutor at six. · The train leaves at 9:10."],
      ["Zaman yan cümlesi", "When, after, before, as soon as ve if ile gelecek anlatan yan cümlede genellikle will kullanılmaz; Present Simple gelir. Ana cümlede will kullanılabilir.", "When she arrives, we will start. · If I pass, I will apply."],
    ],
    summary: ["Anlık karar/tahmin → will.", "Önceden niyet veya görünen kanıt → going to.", "Kesin kişisel düzenleme → Present Continuous."],
  },
  "modals": {
    intro: "Modal fiiller konuşanın yetenek, olasılık, zorunluluk ve tavsiye gibi tutumunu gösterir. Modalden sonra ana fiil yalın hâlde gelir.",
    sections: [
      ["Yetenek ve izin", "Can şimdiki yeteneği ve günlük dilde izni ifade eder. Could geçmişteki genel yeteneği veya daha nazik isteği gösterebilir. Resmî izin için may kullanılabilir.", "She can swim. · Could you repeat the question? · May I enter?"],
      ["Zorunluluk ve yasak", "Must güçlü zorunluluk; have to dış koşuldan gelen gereklilik için sık kullanılır. Mustn't yasak demektir. Don't have to ise yapma zorunluluğu yok demektir; bu ikisi zıt anlamlı değildir.", "You must wear a seat belt. · You mustn't smoke here. · You don't have to come early."],
      ["Tavsiye ve olasılık", "Should tavsiye verir; might/may/could mümkün ama kesin olmayan durumları anlatır. Must güçlü çıkarım için de kullanılabilir. Anlamı cümledeki kanıt belirler.", "You should revise this unit. · It might rain later. · She must be tired."],
      ["Biçim", "Modalden sonra to veya üçüncü tekil -s gelmez: 'She cans' ve 'must to study' yanlıştır. Soru modalin başa alınmasıyla, olumsuz not eklenmesiyle kurulur.", "Can she speak French? · You shouldn't skip the instructions."],
    ],
    summary: ["Modal + yalın fiil; üçüncü tekil -s yok.", "Mustn't = yasak; don't have to = zorunlu değil.", "Should tavsiye, might/may olasılık."],
  },
  "articles-prepositions": {
    intro: "Articles isimlerin belirli olup olmadığını; prepositions ise zaman, yer ve ilişkiyi gösterir. Bu konu kuralları kadar kalıplara da dikkat etmeyi gerektirir.",
    sections: [
      ["A ve an", "İlk kez söz edilen, sayılabilen tekil isimle a/an kullanılır. Seçim yazılışa değil ilk sese bağlıdır: an hour ama a university. Çoğul veya sayılamayan genel isimlere doğrudan a/an gelmez.", "She is an engineer. · It is a useful guide. · I need information."],
      ["The ve sıfır article", "Konuşan ve dinleyen hangi varlığın kastedildiğini biliyorsa the kullanılır. Genel anlamdaki çoğul ve sayılamayan isimlerde çoğu zaman article kullanılmaz; belirli örnekte the gerekir.", "I saw a book. The book was useful. · Books are expensive. · The books on this shelf are new."],
      ["Zaman edatları", "At saat ve belirli an, on gün/tarih, in ay/yıl/mevsim için temel seçimdir. 'At night' ve 'in the morning' gibi yerleşik kalıpları ayrıca öğrenmek gerekir.", "at 8 o'clock · on Monday · in October · in 2026"],
      ["Yer edatları ve kalıp", "In kapalı alan veya geniş bölgeyi, on yüzeyi, at bir nokta/etkinlik yerini anlatabilir. Her kullanım bu basit şemaya sığmaz; 'interested in', 'depend on' gibi fiil/sıfat kalıpları bağlamıyla öğrenilmelidir.", "in the room · on the table · at the station · interested in English"],
    ],
    summary: ["A/an ilk sese göre; the belirli isim için.", "At saat, on gün, in ay/yıl.", "Genel çoğul isim çoğunlukla articlesızdır."],
  },
  "comparison": {
    intro: "Karşılaştırma yaparken sıfatın biçimi ve karşılaştırılan şeylerin sayısı önemlidir. Quantifier seçimi ise ismin sayılabilir olup olmamasına bağlıdır.",
    sections: [
      ["Comparative", "İki kişi/şey karşılaştırılırken kısa sıfata -er, uzun sıfata more gelir ve ardından than kullanılabilir. Good → better, bad → worse gibi düzensiz biçimler vardır.", "This text is easier than that one. · This task is more difficult. · Her score is better."],
      ["Superlative", "Bir grup içindeki en yüksek derece için the + -est veya the most kullanılır. Kısa sıfatlarda yazım değişebilir: big → biggest, easy → easiest.", "This is the easiest question. · It is the most useful chapter."],
      ["Sayılabilir ve sayılamayan", "Many/few sayılabilen çoğul isimlerle; much/little sayılamayan isimlerle kullanılır. Information, advice ve research çoğunlukla sayılamaz. A few ve a little olumlu miktar hissi verir.", "many books · much information · a few questions · a little time"],
      ["Too ve enough", "Too + sıfat olumsuz sonucu olabilecek aşırılığı, sıfat + enough yeterli düzeyi gösterir. Enough isimden önce gelir. 'Enough easy' sırası yanlıştır.", "The text is too long. · The explanation is clear enough. · We have enough time."],
    ],
    summary: ["İki şey: comparative + than; grup: the + superlative.", "Many/few sayılabilir; much/little sayılamayan.", "Too + sıfat; sıfat + enough."],
  },
  "passive": {
    intro: "Passive voice, eylemi yapan kişi yerine eylemden etkilenen kişi veya nesneyi öne çıkarır. Temel yapı uygun zamanda be + V3 biçimindedir.",
    sections: [
      ["Active → passive", "Active cümlenin nesnesi passive cümlenin öznesi olur. Eski özne önemliyse by ile eklenir; bilinmiyorsa veya önemsizse atılır. Her fiil nesne alamadığı için her active cümle passive olmaz.", "Researchers conducted the study. → The study was conducted by researchers."],
      ["Zamanı be taşır", "Present Simple: am/is/are + V3. Past Simple: was/were + V3. Present Perfect: have/has been + V3. V3 aynı kalırken zamanı yardımcı fiil gösterir.", "English is spoken here. · The results were announced. · The report has been published."],
      ["Modal ve soru", "Modal + be + V3 biçimi kullanılır. Soruda yardımcı fiil başa alınır. 'The form must submitted' eksiktir; be gerekir.", "The form must be submitted. · Was the email sent?"],
      ["Sık hata", "Özne ile be uyumlu olmalıdır: 'results were', 'result was'. Active cümlenin zamanını değiştirmeyin ve V2 yerine V3 kullanın. Yapanı göstermek zorunlu değildir.", "The letters were written yesterday. · A new rule is introduced each year."],
    ],
    summary: ["Passive = uygun zamanda be + V3.", "Nesne passive cümlede özne olur.", "Yapan gerekiyorsa by ile eklenir."],
  },
  "relative": {
    intro: "Relative clauses, bir isim hakkında ek bilgi verir. Hangi bağlayıcının seçileceği ismin insan, nesne, yer veya zaman olmasına ve bilginin gerekli olup olmamasına bağlıdır.",
    sections: [
      ["Defining clause", "Hangi kişi/nesne olduğunu belirleyen bilgi cümleden çıkarılırsa anlam eksik kalır. İnsan için who/that, nesne için which/that, yer için where kullanılabilir. Bu türde virgül yoktur.", "The student who won the prize is here. · The book that I bought is useful."],
      ["Non-defining clause", "Zaten belli bir kişi/nesneye sadece ek bilgi verilir; yan cümle virgülle ayrılır. Bu yapıda that kullanılmaz. Ek bilgi çıkarıldığında temel cümle anlaşılır kalır.", "My sister, who lives in Izmir, is a teacher. · The library, which opened last year, is popular."],
      ["Özne ve nesne bağlayıcısı", "Relative pronoun yan cümlede özneyse çıkarılamaz. Nesneyse defining clause içinde çoğu zaman çıkarılabilir. 'The student who helped me' yapısında who özne; 'the student (who) I helped' yapısında nesnedir.", "The person who called is my tutor. · The person (who) I called is my tutor."],
      ["Whose, where, when", "Whose sahiplik, where yer, when zaman ilişkisini kurar. Where ardından yine 'there' eklemek gereksiz tekrar yaratır.", "The student whose bag was lost called us. · The room where we study is quiet."],
    ],
    summary: ["Defining: gerekli bilgi, virgül yok; that olabilir.", "Non-defining: ek bilgi, virgül var; that olmaz.", "Bağlayıcı özneyse çıkarılamaz."],
  },
  "conditionals": {
    intro: "Conditional cümlelerde if yan cümlesi koşulu, ana cümle sonucu verir. Yapı seçimi koşulun genel gerçek, olası gelecek, varsayım veya gerçekleşmemiş geçmiş olmasına bağlıdır.",
    sections: [
      ["Zero ve first", "Zero conditional genel doğruları anlatır: if + Present Simple, Present Simple. First conditional gerçekçi gelecek olasılığıdır: if + Present Simple, will + yalın fiil. If yan cümlesinde genellikle will kullanılmaz.", "If water freezes, it expands. · If it rains tomorrow, we will stay home."],
      ["Second", "Şimdi veya gelecek için gerçek dışı ya da düşük olasılıklı varsayım: if + Past Simple, would + yalın fiil. Buradaki past biçimi mutlaka geçmiş zamanı anlatmaz. Resmî kullanımda 'If I were you' tercih edilir.", "If I had more time, I would read more. · If I were you, I would apply."],
      ["Third", "Geçmişte gerçekleşmemiş koşul ve hayal edilen sonuç: if + had + V3, would have + V3. Gerçek geçmişi değiştirmez; pişmanlık veya alternatif sonuç anlatır.", "If she had left earlier, she would have caught the bus."],
      ["Mixed ve unless", "Mixed conditional geçmiş koşulun şimdiki sonucunu gösterebilir: if + had + V3, would + yalın fiil. Unless, 'if not' anlamı taşır; çoğu kullanımda ayrıca not eklenmez.", "If I had studied more, I would be more confident now. · Unless you hurry, you will miss it."],
    ],
    summary: ["Zero: genel gerçek; first: olası gelecek.", "Second: şimdiki varsayım; third: gerçekleşmemiş geçmiş.", "If yan cümlesinde future için genelde will yok."],
  },
  "gerund-infinitive": {
    intro: "Bir fiilden sonra ikinci bir fiil geldiğinde -ing, to + fiil veya yalın fiil gerekebilir. Seçim ilk fiile ve bazen anlatılmak istenen anlama bağlıdır.",
    sections: [
      ["Gerund (-ing)", "Enjoy, avoid, finish, suggest ve mind sonrasında çoğunlukla -ing gelir. Edattan sonra da fiil -ing biçimindedir. 'Look forward to' içindeki to bir edattır; ardından -ing kullanılır.", "She enjoys reading. · They avoided arriving late. · I look forward to meeting you."],
      ["To-infinitive", "Decide, plan, hope, want, refuse gibi fiiller to + yalın fiil alır. Amaç bildirmek için de to-infinitive kullanılabilir.", "We decided to apply. · I study to improve my English."],
      ["Yalın fiil ve nesne", "Can/must gibi modallerin ve let/make yapılarının ardından yalın fiil gelir. Ask/tell/want + kişi + to-infinitive yapısında kişi araya girer.", "You must study. · Let me explain. · She asked me to wait."],
      ["Anlam değişmesi", "Remember to do henüz yapılacak işi hatırlamaktır; remember doing geçmişte yapılmış işi hatırlamaktır. Stop doing eylemi bırakmak, stop to do ise başka bir şey yapmak için durmaktır.", "Remember to send the form. · I remember sending the form. · He stopped smoking. · He stopped to smoke."],
    ],
    summary: ["Enjoy/avoid + -ing; decide/hope + to + fiil.", "Edattan sonra -ing gelir.", "Remember ve stop gibi fiillerde yapı anlamı değiştirir."],
  },
  "connectors": {
    intro: "Bağlaçlar iki düşünce arasındaki sebep, sonuç, zıtlık veya koşul ilişkisini açık eder. Doğru seçim kadar ardından gelen yapının cümle mi isim mi olduğu da önemlidir.",
    sections: [
      ["Sebep ve sonuç", "Because ve since bir sebep cümlesi başlatır. Therefore ve as a result çoğunlukla iki bağımsız fikir arasında sonuç bildirir. 'Because of' ardından isim veya -ing yapı alır.", "We stayed inside because it rained. · It rained; therefore, we stayed inside. · Because of the rain, we stayed inside."],
      ["Zıtlık", "Although/even though ardından özne + fiil içeren cümle gelir. Despite/in spite of ardından isim veya -ing gelir. However genellikle ayrı bir cümleye geçiş sağlar.", "Although it rained, we went out. · Despite the rain, we went out. · It rained; however, we went out."],
      ["Koşul", "Unless çoğunlukla 'if not' anlamındadır. Provided that/as long as bir koşulun sağlanması gerektiğini vurgular. Unless ile tekrar not kullanmak çoğu durumda çift olumsuz yaratır.", "You can enter if you have a ticket. · You cannot enter unless you have a ticket."],
      ["Noktalama ve anlam", "Although ile however aynı işlevde değildir: although yan cümle kurar, however bağımsız fikirler arasında geçiş yapar. Noktalama, iki tam cümleyi yanlış biçimde tek virgülle birleştirmemeye yardımcı olur.", "Although it was late, we continued. · It was late; however, we continued."],
    ],
    summary: ["Although + cümle; despite + isim/-ing.", "Because sebep; therefore sonuç.", "However bağımsız fikirler arasında geçiş yapar."],
  },
  "exam-skills": {
    intro: "Bu bölüm bir dil bilgisi kuralı değil, sınavdaki grammar sorularını çözme yöntemidir. Doğru cevabı yalnızca tek bir kelimeye bakarak değil, cümlenin tamamındaki yapı ve anlamı kontrol ederek seçersin.",
    sections: [
      ["Önce cümleyi çöz", "Boşluktan önce ve sonra özne, yardımcı fiil, fiil biçimi ve zaman ipuçlarını bul. Örneğin 'didn't' görürsen ardından yalın fiil beklersin; 'has' görürsen V3 gerekebilir.", "She didn't ___ the form. → send · She has ___ the form. → sent"],
      ["Anlam ilişkisini belirle", "Bağlaç sorusunda iki fikir arasında sebep mi, sonuç mu, zıtlık mı var? Yalnızca Türkçe karşılığa göre değil, bağlaçtan sonra tam cümle mi isim mi geldiğine göre karar ver.", "___ the rain, we went out. → Despite · ___ it rained, we went out. → Although"],
      ["Seçenekleri ele", "Önce kesin yanlış zaman, özne-fiil uyumsuzluğu ve yanlış sözcük türünü sil. Kalan seçenekleri tüm cümlede deneyip anlamı tekrar oku. Benzer görünen seçenekler farklı yapı gerektirebilir.", "The results ___ yesterday. → were announced; çoğul özne ve geçmiş zaman."],
      ["Reading ile kanıt kontrolü", "Reading sorularında bir seçeneğin metindeki kelimeyi tekrar etmesi yeterli değildir; cümledeki iddiayı destekleyen satırı bul. 'Not stated' ile 'false' ayrımını kanıt olmadan tahmin etme.", "Metin: 'Some students applied.' → 'All students applied' sonucu çıkarılamaz."],
    ],
    summary: ["Önce yapı ve zaman ipuçları, sonra anlam.", "Seçenekleri tüm cümlede dene.", "Reading cevabını metindeki kanıta bağla."],
  },
  "inversion": {
    intro: "Inversion, vurgu için normal özne–yardımcı fiil sırasını tersine çevirir. Özellikle sınırlayıcı veya olumsuz ifadeler cümle başına geldiğinde resmî yazıda görülür.",
    sections: [
      ["Negatif/sınırlayıcı zarflar", "Never, rarely, seldom, hardly ever gibi ifadeler başa alınınca yardımcı fiil özneden önce gelir. Normal cümlede yardımcı fiil yoksa do/does/did eklenir.", "I have never seen this. → Never have I seen this. · She rarely speaks. → Rarely does she speak."],
      ["Not only ve only", "Not only cümle başındaysa ilk bölümde inversion olur; but also ile gelen ikinci bölüm normal düzendedir. Only after/when/then gibi sınırlayıcı ifadelerde inversion ana cümlede olur.", "Not only was he late, but he also forgot the file. · Only after the exam did I relax."],
      ["Hardly/No sooner", "Hardly ... when ve No sooner ... than yapıları iki yakın geçmiş olayı vurgular. Önceki olay genellikle Past Perfect ile kurulur.", "Hardly had we arrived when it started raining. · No sooner had she left than he called."],
      ["Koşulda inversion", "Resmî dilde if kaldırılıp had, were veya should başa alınabilir. Bu, anlamı korurken cümleyi daha resmî yapar; her if cümlesine gelişigüzel uygulanmaz.", "If I had known → Had I known. · If I were you → Were I you."],
    ],
    summary: ["Baştaki negatif/sınırlayıcı ifade → yardımcı fiil + özne.", "Yardımcı fiil yoksa do/does/did ekle.", "Only after ile inversion ana cümlede olur."],
  },
  "advanced-modals": {
    intro: "Past modals, geçmiş bir olay hakkında çıkarım, olasılık, eleştiri veya kaçırılmış fırsat anlatır. Temel biçim modal + have + V3'tür.",
    sections: [
      ["Geçmişe yönelik çıkarım", "Must have + V3 güçlü olumlu çıkarımdır. Can't/couldn't have + V3 güçlü olumsuz çıkarımdır. Bu yapılar olayın doğrulanmış bilgisini değil, eldeki kanıta dayalı yorumu ifade eder.", "Her bag is here; she must have arrived. · He was abroad; he can't have attended."],
      ["Olasılık", "May/might/could have + V3 geçmişte olmuş olabilecek bir şeyi belirtir. Bu üçü çoğu bağlamda kesinlik ifade etmez; bağlam ve ton farkı olabilir.", "She might have missed the bus. · They could have taken another route."],
      ["Eleştiri ve beklenti", "Should have + V3 yapılması iyi olacakken yapılmayan eylemi; shouldn't have + V3 yapılmaması gerekirken yapılan eylemi anlatır. Needn't have + V3 ise yapılan ama gerekli olmayan işi belirtir.", "You should have revised. · You shouldn't have shared the answer. · You needn't have waited."],
      ["Kaçırılmış fırsat", "Could have + V3 bazen yapılabilecek ama yapılmamış seçeneği anlatır. 'Could have' ile 'could' aynı zamanı göstermez; have + V3 geçmiş yorumunu kurar.", "We could have applied earlier, but we missed the deadline."],
    ],
    summary: ["Modal + have + V3 geçmişe bakar.", "Must have güçlü çıkarım; might have olasılık.", "Should have geçmiş eleştiri; could have kaçırılmış fırsat."],
  },
  "nominalisation": {
    intro: "Nominalisation, fiil veya sıfatla anlatılan bir eylem ya da niteliği isim biçimine dönüştürür. Akademik metinlerde bilgiyi yoğunlaştırır; aşırı kullanılırsa cümleyi ağırlaştırır.",
    sections: [
      ["Fiilden isme", "Decide → decision, analyse → analysis, implement → implementation gibi dönüşümlerde cümlenin ana eylemi isimleşir. Sıklıkla make, conduct, carry out gibi başka bir fiille birlikte kullanılır.", "They decided to change the rule. → They made a decision to change the rule."],
      ["Sıfattan isme", "Accurate → accuracy, effective → effectiveness gibi dönüşümler bir niteliği kavram olarak ifade eder. Her kelimenin eki aynı değildir; biçim sözlükten kontrol edilmelidir.", "The method is accurate. → The accuracy of the method is high."],
      ["Cümledeki görev", "Article (the/a), iyelik (their/its) veya sıfat (careful) sonrasında çoğu kez isim beklenir. Boşluk sorusunda önce gereken sözcük türünü belirlemek doğru biçimi seçmeyi kolaylaştırır.", "Their analysis was thorough. · The implementation took months."],
      ["Okunabilirlik", "İsimleştirme akademik ton sağlar ama kimin ne yaptığını gizleyebilir. Açık anlatım gereken yerde doğrudan fiil daha iyidir. 'The implementation of the policy was conducted' yerine çoğu zaman 'The team implemented the policy' daha nettir.", "The team analysed the data. ↔ An analysis of the data was conducted."],
    ],
    summary: ["Fiil/sıfat → isim: decide → decision; accurate → accuracy.", "Article ve iyelikten sonra sözcük türünü kontrol et.", "Gereksiz isimleştirme cümleyi ağırlaştırır."],
  },
};
