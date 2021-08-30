(function () {
    CARDS = Object.keys(data.cards);

    function arrCount(arr, val) {
        var cnt, i, len;
        for (cnt = 0, i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == val) { cnt += 1}
        }
        return cnt;
    }

    function deckToCode(deck) {
        var c, p, i, len, cardName, arr, cnts, codes, code;
        deck.sort();
        arr = [];
        cnts = [];
        for (i = 0, len = deck.length; i < len; i++) {
            cardName = deck[i];
            p = CARDS.indexOf(cardName);
            if (arr.indexOf(p) != -1) { continue; }
            c = arrCount(deck, cardName);
            arr.push(p);
            cnts.push(c);
        }
        codes = [];
        for (i = 0, len = arr.length; i < len; i++) {
            codes.push(arr[i]);
            codes.push(cnts[i]);
        }
        code = nowClass + '-' + codes.join('-');
        console.log(code);
        //code = encodeURI(code);
        return code;
    }

    document.getElementById('import').addEventListener('click', function () {
        var url = document.getElementById('deck').value;
        $.ajax({
            type: 'POST',
            url: './importer.php',
            data: {
                'url': url
            }
        }).done(function (source) {
            var body, backup, CLASS, Class, deck, code, names, name, counts, count, i, len, k,
                result, nextURL;
            body = document.body;
            body.style.display = 'none';
            backup = body.innerHTML;
            body.innerHTML = source;

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
            console.log(deck);
            code = deckToCode(deck, Class);

            //code = Class + '-' + deck.join('-');
            nextURL = 'http://shadowverse.coresv.com/#' + code;

            body.innerHTML = backup;
            body.style.display = '';
            result = document.getElementById('result');
            result.innerHTML = '変換成功。<a href="' + nextURL +' ">こちら</a>にアクセスしてください。';
            setTimeout(function () {
                location.href = nextURL;
            }, 10000);
        });
    }, false);

})();
