(function () {
    var CLASS, Class, deck, code, names, name, counts, count, i, len, k;

    CLASS = ['エルフ', 'ロイヤル', 'ウィッチ', 'ドラゴン',
        'ネクロマンサー', 'ヴァンパイア', 'ビショップ', 'ニュートラル'];

    ClassName = document.querySelector('.deck-summary-top-image').alt;
    Class = CLASS.indexOf(ClassName);

    deck = [];
    names = document.querySelectorAll('.el-card-list-info-name-text');
    counts = document.querySelectorAll('.el-card-list-info-count');
    for (i = 0, len = names.length; i < len; i++) {
        name = names[i].textContent;
        count = +(counts[i].textContent.substr(1));
        for (k = 0; k < count; k++) {
            deck.push(name);
        }
    }
    console.log(deck.length);
    console.log(deck);

    code = Class + '-' + deck.join('-');
    location.href = 'http://scc.coresv.com/#' + code;
})();

