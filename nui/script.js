var EXPIRED = 7

$(document).ready(function() {
    window.addEventListener("message", function (event) {
        data = event.data;

        var rtv = ""
        for (var i = 0; i < data.length; i++) {
            var timestamp = new Date(parseInt(data[i]));
            var formattedTime = timestamp.toLocaleString('he-IL', {timeZone: "Israel"})
            var timenow = new Date(Date.now());

            const after = ((timenow - timestamp) / (1000 * 60 * 60 * 24))
            var exp = (after > EXPIRED) ? true : false;
            const timeleft = (7 - after) | 0

            rtv += `<div id="voterow" class="row" dts=${data[i]}>
                <div class="col s8 panel vote_text">
                    <span id="title" ${(exp == true ? 'style="color: red"' : "")}>Server Vote ${(exp == true ? "- Expired" : `- ${timeleft} Days Left`)}</span><br>
                    <span id="date">Date: ${formattedTime}</span>
                </div>
                <div class="col s4 panel vote_claim">
                     ${(exp == false ? '<button class="col s6 waves-effect waves-light btn claim_btn">CLAIM</button>' : "")}
                     <input class="col s6 claim_code" placeholder="2FA CODE"></input>
                </div>
            </div>`
        }; $('.scroll-container').html(rtv);
        $('#errMessage').html(''); $('#errMessage').hide();
        $('.container').fadeIn(500);
    });
});

$(document).on("input", ".claim_code", function (e) {
    if ($(this).val().length == 6 && !isNaN(parseInt($(this).val()))) {
        var elem = $(this);
        $.post(`https://${GetParentResourceName()}/claim`, JSON.stringify({
            ts: elem.parent().parent().attr("dts"),
            code: elem.val()
        }), function(res) {
            if (res.value == 'ok') {
                elem.parent().parent().remove()
                message('success', 'ok')
            } else {
                elem.fadeIn()
                message('error', res.value)
            }
        })
        elem.hide()
        elem.val('')
    }
})

document.onkeyup = function (data) {
    if (data.which == 27) {
        $.post(`https://${GetParentResourceName()}/nui`)
        $('.container').fadeOut(250)
    }
};

$(document).on("click", ".claim_btn", function (e) {
    const elem = $(this);
    $.post(`https://${GetParentResourceName()}/claim`, JSON.stringify({
        ts: elem.parent().parent().attr("dts")
    }), function(res) {
        if (res.value == 'sent' || res.value == 'already_sent') {
            elem.fadeOut(0);
            elem.parent().find('.claim_code').fadeIn(250);
            if (res.value == 'already_sent') message('error', 'Last 2FA is still active')
        } else {
            message('error', res.value)
        }
    })
});

function message(style, code) {
    const codeList = {
        dms_disabled: "Your DM's are disabled",
        not_authorized: "You're not authorized to do this action",
        wrong: "Wrong 2FA Code",
        ok: "You received your prize!",
        could_not_find_vote: "Could'nt find this vote",
        already_active: "Too much requests, Try again later",
        not_in_discord: "You must be in FiveM-IL's Discord in order to claim votes"
    }

    $('#errMessage').html(codeList[code] ? codeList[code] : code);
    $('#errMessage').css('color', style == 'success' ? "#26a69a" : "#ef5350");
    $('#errMessage').fadeIn(50);
}

$(document).on("click", "a", function (e) {
    const el = document.createElement('textarea');
    el.value = $(this).attr("copy");
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true
});