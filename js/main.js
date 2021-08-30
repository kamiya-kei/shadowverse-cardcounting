//data = { data: { cardName: [Class, Type, Rarity, Cost] }}

(function (window, document, undefined) {
    var page, articles, gamebtn, code, codeE, arts,
        playing, deck, pull, nowClass,
        CARDS, CLASS, TYPE, RARITY;

    playing = false;
    deck = [];
    pull = 1;
    nowClass = 0;

    CARDS = Object.keys(data.cards);
    CLASS = ['エルフ', 'ロイヤル', 'ウィッチ', 'ドラゴン',
        'ネクロマンサー', 'ヴァンパイア', 'ビショップ', 'ニュートラル'];
    TYPE = ['フォロワー', 'スペル', 'アミュレット'];
    RARITY = ['ブロンズレア', 'シルバーレア', 'ゴールドレア', 'レジェンド'];

    articles = document.querySelectorAll('article');
    codeE = document.querySelector('#Save input');
    arts = $('#Game, #Readme, #Save');

    $.tablesorter.addParser({
        id: 'num', 
        is: function(s) { return false; },
        format: function(s) {
            return +s.substr(1, s.length-2);
        }, 
        type: 'numeric' 
    });
    $.tablesorter.addParser({
        id: 'num2', 
        is: function(s) { return false; },
        format: function(s) {
            return +s.substr(1, s.length-4);
        }, 
        type: 'numeric' 
    });
    $.tablesorter.addParser({
        id: 'class', 
        is: function(s) { return false; },
        format: function(s) {
            return CLASS.indexOf(s);
        }, 
        type: 'numeric' 
    });
    $.tablesorter.addParser({
        id: 'type', 
        is: function(s) { return false; },
        format: function(s) {
            return TYPE.indexOf(s);
        }, 
        type: 'numeric' 
    });
    $.tablesorter.addParser({
        id: 'rarity', 
        is: function(s) { return false; },
        format: function(s) {
            return RARITY.indexOf(s);
        }, 
        type: 'numeric' 
    });
    $.tablesorter.addParser({
        id: 'per', 
        is: function(s) { return false; },
        format: function(s) {
            return s.substr(0, s.length-1);
        }, 
        type: 'numeric' 
    });

    function scroll(target) {
        $('body,html').animate({
            scrollTop: $(target).offset().top
        }, 400, 'swing');
    }
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
    function codeToDeck(code) {
        var arr, cardName, i, len, k, size;
        //code = decodeURI(code);
        arr = code.split('-');
        nowClass = +arr.splice(0, 1);
        cardSelect(nowClass);
        deck = [];
        for (i = 0, len = arr.length; i < len; i+= 2) {
            cardName = CARDS[+arr[i]];
            for (k = 0, size = +arr[i+1]; k < size; k++) {
                deck.push(cardName);
            }
        }
        console.log(deck);
        return deck;
    }

    /* クラスセレクト
    -----------------------------------------------------------------------------------------------*/
    function reset(Class) {
        if (playing) {
            alert('ゲームプレイ中です。');
            return;
        }
        if (deck.length > 0) {
            if (!window.confirm('選択カードがリセットされます。よろしいですか？')) {
                return;
            }
        }

        arts.hide();
        cardSelect(Class);
        scroll('#CardSelect');
    }

    (function () {
        //ClassSelect
        var btns, btn, i, len;
        btns = document.querySelectorAll('#ClassSelect button');
        for (i = 0, len = btns.length; i < len; i++) {
            btn = btns[i];
            btn.className = 'gf-btn-b';
            (function (Class) {
                btn.addEventListener('click', function () {
                    /* クラスセレクト クリック -------------------------------------------------- */
                    nowClass = Class;
                    reset(nowClass);
                    /* -------------------------------------------------------------------------- */
                }, false);
            })(i);
        }
    })();

    /* カードセレクト
    -----------------------------------------------------------------------------------------------*/
    //リセット
    document.querySelector('#CardSelect p button').addEventListener('click', function () {
        reset(nowClass);
    }, false);

    function cardSelect(selectClass) {
        var data, i, len, arr,
            card, d, cardClass, cardType, cardRarity, cardCost,
            span, tbody, tr, tdCount, tdName, tdClass, tdType, tdRarity, tdCost,
            plus, minus, num;
        data = window.data.cards;

        deck = [];

        span = document.querySelector('#CardSelect p span');
        tbody = document.querySelector('#CardSelect tbody');
        tbody.innerHTML = '';

        tr = document.createElement('tr');

        tdCount = document.createElement('td');
        minus = document.createElement('button');
        minus.className = 'gf-btn-sp';
        minus.textContent = '-';
        num = document.createElement('span');
        plus = document.createElement('button');
        plus.className = 'gf-btn-sb';
        plus.style.marginLeft = '5px';
        plus.textContent = '+';
        tdCount.appendChild(minus);
        tdCount.appendChild(num);
        tdCount.appendChild(plus);

        tdName = document.createElement('td');
        tdClass = document.createElement('td');
        tdType = document.createElement('td');
        tdRarity = document.createElement('td');
        tdCost = document.createElement('td');
        tr.appendChild(tdCount);
        tr.appendChild(tdName);
        tr.appendChild(tdClass);
        tr.appendChild(tdType);
        tr.appendChild(tdRarity);
        tr.appendChild(tdCost);

        for (i = 0, len = CARDS.length; i < len; i++) {
            card = CARDS[i];
            d = data[card];
            Class = d[0];
            Type = d[1];
            Rarity = d[2];
            Cost = d[3];
            if (Class != 7 && Class != selectClass) {
                continue
            }
            num.textContent = 0;
            tdName.textContent = card;
            tdClass.textContent = CLASS[Class];
            tdType.textContent = TYPE[Type];
            tdRarity.textContent = RARITY[Rarity];
            tdCost.textContent = Cost;
            tbody.appendChild(tr.cloneNode(true));
        }

        arr = document.querySelectorAll('#CardSelect table button');
        for (i = 0, len = arr.length; i < len; i++) {
            arr[i].addEventListener('click', function () {
                /* カード 追加＆削除 -------------------------------------------------- */
                var tr, td, span2, n, k, name;
                if (playing) {
                    alert('ゲームプレイ中です');
                    return;
                }
                td = this.parentNode;
                tr = td.parentNode;
                span2 = td.querySelector('span');
                n = +span2.textContent;
                name = tr.querySelector('td:nth-of-type(2)').textContent;
                if (this.textContent == '-') {
                    if (n == 0) { return; }
                    k = String(n-1);
                    deck.splice(deck.indexOf(name), 1);
                } else {
                    if (n == 3) { return; }
                    if (deck.length == 40) {
                        alert('既に40枚選択済みです');
                        return;
                    }
                    k = String(n+1);
                    deck.push(name);
                }
                span.textContent = deck.length;
                span2.textContent = k;
                $('#CardSelect table').trigger("update");
                //console.log(deck);
                if (deck.length == 40) {
                    code = deckToCode(deck);
                    codeE.value = document.location.href;
                    arts.show();
                    document.location.hash = code;
                    //scroll('#Game');
                }
                /* ------------------------------------------------------------------ */
            }, false);
        }

        $('#CardSelect table').tablesorter({
            headers: {
                0: { sorter: 'num' },
                2: { sorter: 'class' },
                3: { sorter: 'type' },
                4: { sorter: 'rarity' }
            }
        });
    }

    /* ゲーム
    -----------------------------------------------------------------------------------------------*/
    function nPk(n, k) {
        var r, i;
        for (r = n, i = 1; i < k; i++) {
            r *= --n;
        }
        return r;
    }
    function updateP(x) {
        //少なくとも1枚引く確率＝１－引かない確率
        var all, n, p, arr, i, len,
            tr, td;
        all = +document.querySelector('#Game p span').textContent;
        arr = document.querySelectorAll('#Game table tr');
        for (i = 1, len = arr.length; i < len; i++) {
            tr = arr[i];
            td = tr.querySelector('td');
            n = +tr.querySelector('span').textContent;
            p = nPk(all-n, x) / nPk(all, x);
            td.textContent = String(Math.round((1 - p) * 10000) / 100) + '%';
        }
    }

    gamebtn = document.querySelector('#Game button');
    gamebtn.addEventListener('click', function () {
        /* ゲーム 開始＆リセット -----------------------------------------  */
        var tbody, cardList, data, span, cnt,
            name, n, d, Class, Type, Rarity, Cost,
            tr, tdP, tdCount, tdName, tdClass, tdType, tdRarity, tdCost,
            minus, num, plus, num2, txt,
            i, len;

        if (deck.length < 40) {
            alert('カードを40枚選択してください');
            return;
        }

        tbody = document.querySelector('#Game tbody');
        if (playing) {
            if (window.confirm('本当にリセットしますか？')) {
                playing = false;
                gamebtn.textContent = 'ゲーム開始';
                gamebtn.className = 'gf-btn-b';
                tbody.innerHTML = '';
            }
            return;
        }
        playing = true;
        gamebtn.textContent = 'リセット';
        gamebtn.className = 'gf-btn-p';

        data = window.data.cards;
        span = document.querySelector('#Game p span');
        cnt = 40;
        span.textContent = cnt;

        cardList = [];
        for (i = 0, len = deck.length; i < len; i++) {
            name = deck[i];
            if(cardList.indexOf(name) == -1) {
                cardList.push(name);
            }
        }

        tr = document.createElement('tr');
        tdP = document.createElement('td');
        tdP.textContent = '-';

        tdCount = document.createElement('td');
        minus = document.createElement('button');
        minus.className = 'gf-btn-sp';
        minus.textContent = '-';
        num = document.createElement('span');
        plus = document.createElement('button');
        plus.className = 'gf-btn-sb';
        plus.style.marginLeft = '5px';
        plus.textContent = '+';
        txt = document.createTextNode('/');
        num2 = document.createElement('span');
        tdCount.appendChild(minus);
        tdCount.appendChild(num);
        tdCount.appendChild(plus);
        tdCount.appendChild(txt);
        tdCount.appendChild(num2);

        tdName = document.createElement('td');
        tdClass = document.createElement('td');
        tdType = document.createElement('td');
        tdRarity = document.createElement('td');
        tdCost = document.createElement('td');
        tr.appendChild(tdP);
        tr.appendChild(tdCount);
        tr.appendChild(tdName);
        tr.appendChild(tdClass);
        tr.appendChild(tdType);
        tr.appendChild(tdRarity);
        tr.appendChild(tdCost);

        for (i = 0, len = cardList.length; i < len; i++) {
            name = cardList[i];
            n = arrCount(deck, name);
            d = data[name];
            Class = d[0];
            Type = d[1];
            Rarity = d[2];
            Cost = d[3];

            num.textContent = n;
            num2.textContent = n;
            tdName.textContent = name;
            tdClass.textContent = CLASS[Class];
            tdType.textContent = TYPE[Type];
            tdRarity.textContent = RARITY[Rarity];
            tdCost.textContent = Cost;
            tbody.appendChild(tr.cloneNode(true));
        }

        arr = document.querySelectorAll('#Game table button');
        for (i = 0, len = arr.length; i < len; i++) {
            arr[i].addEventListener('click', function () {
                /* カード 捨てる＆戻す(訂正) --------------------------------------- */
                var td, n1, n2, n, max, k, tmp;

                td = this.parentNode;
                tmp = td.querySelectorAll('span');
                n1 = tmp[0];
                n2 = tmp[1];
                n = +n1.textContent;
                max = +n2.textContent;

                if (this.textContent == '-') {
                    if (n == 0) { return; }
                    k = String(n-1);
                    cnt--;
                } else {
                    if (n == max) { return; }
                    k = String(n+1);
                    cnt++;
                }
                td.parentNode.className = (k == 0) ? 'nothing' : (k != max) ? 'notmax' : '';
                n1.textContent = k;
                span.textContent = cnt;
                if (cnt == 0) {
                    if (window.confirm('0枚になりました！リセットしますか？')) {
                        playing = false;
                        gamebtn.textContent = 'ゲーム開始';
                        gamebtn.className = 'gf-btn-b';
                        tbody.innerHTML = '';
                        return;
                    }
                }
                updateP(pull);
                $('#Game table').trigger("update");
                /*  ------------------------------------------------------------ */
            }, false);
        }

        updateP(pull);
        $('#Game table').tablesorter({
            headers: {
                0: { sorter: 'per'},
                1: { sorter: 'num2' },
                3: { sorter: 'class' },
                4: { sorter: 'type' },
                5: { sorter: 'rarity' }
            }
        });
    }, false);


    //引く枚数ボタン
    (function () {
        var btns, i, len, isMore, moreArea;
        btns = document.querySelectorAll('#pull button');
        for (i = 0, len = btns.length; i < len; i++) {
            (function (btn, k) {
                btn.addEventListener('click', function () {
                    if (k == pull) { return; }
                    btns[pull-1].className = 'gf-btn-sb';
                    btns[k-1].className = 'gf-btn-sp';
                    pull = k;
                    if (playing) { updateP(pull); }
                }, false);
            })(btns[i], i + 1);
        }

        isMore = false;
        moreArea = $('#pull span');
        document.querySelector('#pull input').addEventListener('click', function () {
            isMore = !isMore;
            moreArea.toggle();
        }, false);

    })();

    //デッキ復元
    function loadDeck() {
        var hash, arr, i, len,
            tr, name, num, span;
        hash = document.location.hash;
        if (!hash) { return; }

        deck = codeToDeck(hash.substr(1));
        //scroll('#CardSelect');

        document.querySelector('#CardSelect p span').textContent = deck.length;
        arr = document.querySelectorAll('#CardSelect table tr');
        for (i = 1, len  = arr.length; i < len; i++) {
            tr = arr[i];
            name = tr.querySelector('td:nth-of-type(2)').textContent;
            //console.log(name);
            if (deck.indexOf(name) == -1) { continue; }
            num = arrCount(deck, name);
            span = tr.querySelector('span').textContent = num;
        }
        $('#CardSelect table').trigger("update");

        arts.show();
        codeE.value = document.location.href;
        scroll('#Game');
    };

    $(window).on('hashchange', function () {
        loadDeck();
    }).trigger('hashchange');

    document.getElementById('toImport').addEventListener('click', function () {
        location.href = './import.html';
    }, false);

    //zunko
    /*
    (function () {
        var audio;
        audio = new Audio('./js/title.mp3');
        audio.load();
        audio.addEventListener('canplaythrough', function () {
            audio.play();
        });
    })();
    */

})(window, document);
