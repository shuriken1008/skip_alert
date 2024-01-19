var idleTime = 0;
var idleInterval = 0;
var WPSidleTime = 0;
var DownloadOTAProgressInterval = 0;
var WPSidleInterval = 0;
var Session_inactivity_timeout = 10;
// var session_token = localStorage.getItem("session_token") ? localStorage.getItem("session_token") : '';
var session_token = getCookie('session_token') ? getCookie('session_token') : '';
var Locks = localStorage.getItem("Locks") ? JSON.parse(localStorage.getItem("Locks")) : '';
var acTimer = downloadTimer = '';
var indexSessionCheckToServer = 0;
var dfsCheckToServer = 0;
var homeSessionCheckToServerInterval = 0;
var allowCountryCode = ["440", "441"];

$("#footer-section").load("5g-footer.html", function (responseTxt, statusTxt, xhr) {

    if (!session_token) {
        showLoginSection();
    } else {
        showUserMenu();
    }



    var lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'jp';
    changeLanguage(lang);
    active_menu();
    menu_ctl();

});


$(window).on('load', function () {
    //$.LoadingOverlay("hide");

});



$(document).ready(function () {

    $(".form-control:not(.show-password)").hide();
    $(".custom-switch").hide();
    $(".custom-checkbox").hide();

    // Session inactivity ( mouse and Keyboard) triggers timeout
    if (session_token) {
        var idleInterval = self.setInterval("timerIncrement()", 60000); // 1 minute  
        //Zero the idle timer on mouse movement.
        $(this).mousemove(function (e) {
            idleTime = 0;
        });
        $(this).keypress(function (e) {
            idleTime = 0;
        });
    }

});


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function delete_cookie(name) {
    document.cookie = name + '=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

function changeLanguage(lang) {
    var i18nLanguage = lang;
    jQuery.i18n.properties({
        name: 'common',
        path: 'i18n/',
        mode: 'map',
        language: i18nLanguage,
        async: true,
        //debug: true,
        callback: function () {
            $("[data-locale]").each(function () {
                $(this).html($.i18n.prop($(this).data("locale")));
            });
            localStorage.setItem('language', i18nLanguage);

            switch (i18nLanguage) {
                case "jp":
                    $(".lang_text_large").text($.i18n.prop("nav.JpLong"));
                    $(".lang_text_small").text($.i18n.prop("nav.Jp"));
                    break;
                case "en":
                    $(".lang_text_large").text($.i18n.prop("nav.EnLong"));
                    $(".lang_text_small").text($.i18n.prop("nav.En"));
                    break;
                default:
                    $(".lang_text_large").text($.i18n.prop("nav.JpLong"));
                    $(".lang_text_small").text($.i18n.prop("nav.Jp"));
                    break;
            }

            var SignalStatus = localStorage.getItem('SignalStatus');
            if(SignalStatus == "0" || SignalStatus=="3") {
                var icon = "assets/img/5g_status/ic_status_signal_out_service_en.svg";
                switch (SignalStatus) { // out of service
                    case "0":
                        //icon = "assets/img/5g_status/ic_status_signal_out_service.svg";
            
                        switch (i18nLanguage) {
                            case "jp":
                                icon = "assets/img/5g_status/ic_status_signal_out_service_jp.svg";
                                break;
                            default:
                                icon = "assets/img/5g_status/ic_status_signal_out_service_en.svg";
                                break;
                        }
                        break;
                    
                    case "3":
                        switch (i18nLanguage) {
                            case "jp":
                                icon = "assets/img/5g_status/ic_status_signal_out_service_jp.svg";
                                break;
                            default:
                                icon = "assets/img/5g_status/ic_status_signal_out_service_en.svg";
                                break;
                        }
                        break;
                }
                $(".signal_icon").attr("src", icon);
            }
        }
    });
}


function active_menu() {
    var pathArray = window.location.pathname.split('/');
    var pathFile = pathArray[1];
    var updatePWD = localStorage.getItem("updatePWD");
    if (session_token && updatePWD == "no" && pathFile != "mifi-system-settings-webui-password.html") {
        alert($.i18n.prop("home.Pleasechangepassword"));
        //location.href = 'mifi-system-settings-webui-password.html';
        return true;
    }
    switch (pathFile) {
        case "index.html":
            $("#mifi-home").addClass('active');
            break;
        case "mifi-index.html":
            $("#mifi-home").addClass('active');
            break;
        // ===============================
        case "mifi-connect-client_list.html":
            $("#mifi-connect-client_list").addClass('active');
            $("#mifi-connect-client_list").parents("li").addClass('active');
            break;
        case "mifi-lan-wifi-mac-address-filter.html":
            $("#mifi-lan-wifi-mac-address-filter").addClass('active');
            $("#mifi-lan-wifi-mac-address-filter").parents("li").addClass('active');
            break;
        // ===============================
        case "mifi-network-configuration.html":
            $("#mifi-network-configuration").addClass('active');
            $("#mifi-network-configuration").parents("li").addClass('active');
            break;
        case "mifi-roaming-settings.html":
            $("#mifi-roaming-settings").addClass('active');
            $("#mifi-roaming-settings").parents("li").addClass('active');
            break;
        case "mifi-apn-profile-setting_edit.html":
            $("#mifi-apn-profile-setting_edit").addClass('active');
            $("#mifi-apn-profile-setting_edit").parents("li").addClass('active');
            break;
        case "mifi-pin-management.html":
            $("#mifi-pin-management").addClass('active');
            $("#mifi-pin-management").parents("li").addClass('active');
            break;
        case "mifi-pin-management-unlock.html": 
            $("#mifi-pin-management").addClass('active');
            $("#mifi-pin-management").parents("li").addClass('active');
            break;
        // ---------------------------
        case "mifi-lan-wifi-dhcp.html":
            $("#mifi-lan-wifi-dhcp").addClass('active');
            $("#mifi-lan-wifi-dhcp").parents("li").addClass('active');
            break;
        case "mifi-lan-firewall.html":
            $("#mifi-lan-firewall").addClass('active');
            $("#mifi-lan-firewall").parents("li").addClass('active');
            break;
        case "mifi-lan-ip-filtering.html":
            $("#mifi-lan-ip-filtering").addClass('active');
            $("#mifi-lan-ip-filtering").parents("li").addClass('active');
            break;
        case "mifi-lan-wifi-dhcp.html":
            $("#mifi-lan-wifi-dhcp").addClass('active');
            $("#mifi-lan-wifi-dhcp").parents("li").addClass('active');
            break;
        case "mifi-router_setting_port_mapping.html":
            $("#mifi-router_setting_port_mapping").addClass('active');
            $("#mifi-router_setting_port_mapping").parents("li").addClass('active');
            break;
        case "mifi-router_setting_port_trigger.html":
            $("#mifi-router_setting_port_trigger").addClass('active');
            $("#mifi-router_setting_port_trigger").parents("li").addClass('active');
            break;
        case "mifi-router_settings_upnp_settings.html":
            $("#mifi-router_settings_upnp_settings").addClass('active');
            $("#mifi-router_settings_upnp_settings").parents("li").addClass('active');
            break;
        case "mifi-router_settings_nat_settings.html":
            $("#mifi-router_settings_nat_settings").addClass('active');
            $("#mifi-router_settings_nat_settings").parents("li").addClass('active');
            break;
        case "mifi-router_settings_vpn_settings.html":
            $("#mifi-router_settings_vpn_settings").addClass('active');
            $("#mifi-router_settings_vpn_settings").parents("li").addClass('active');
            break;                            
        case "mifi-router_settings_dmz_settings.html":
            $("#mifi-router_settings_dmz_settings").addClass('active');
            $("#mifi-router_settings_dmz_settings").parents("li").addClass('active');
            break;
        // -------------------------------
        case "mifi-lan-wifi-basic.html":
            $("#mifi-lan-wifi-basic").addClass('active');
            $("#mifi-lan-wifi-basic").parents("li").addClass('active');
            break;
        case "mifi-lan-wifi-advanced.html":
            $("#mifi-lan-wifi-advanced").addClass('active');
            $("#mifi-lan-wifi-advanced").parents("li").addClass('active');
            break;
        case "mifi-wifi-settings-wps-idle.html":
            $("#mifi-wifi-settings-wps-idle").addClass('active');
            $("#mifi-wifi-settings-wps-idle").parents("li").addClass('active');
            break;
        //
        case "mifi-system-settings-webui-password.html":
            $("#mifi-system-settings-webui-password").addClass('active');
            $("#mifi-system-settings-webui-password").parents("li").addClass('active');
            break;


        case "mifi-device-settings-data-usage-settings.html":
            $("#mifi-device-settings-data-usage-settings").addClass('active');
            $("#mifi-device-settings-data-usage-settings").parents("li").addClass('active');
            break;
        case "mifi-device-settings-ethernet-settings.html":
            $("#mifi-device-settings-ethernet-settings").addClass('active');
            $("#mifi-device-settings-ethernet-settings").parents("li").addClass('active');
            break;        
        case "mifi-wifi-settings-dateTime.html":
            $("#mifi-wifi-settings-dateTime").addClass('active');
            $("#mifi-wifi-settings-dateTime").parents("li").addClass('active');
            break;                    
        case "mifi-device-settings-usb-mode.html":
            $("#mifi-device-settings-usb-mode").addClass('active');
            $("#mifi-device-settings-usb-mode").parents("li").addClass('active');
            break;
        case "mifi-system-settings-backup-and-restore.html":
            $("#mifi-system-settings-backup-and-restore").addClass('active');
            $("#mifi-system-settings-backup-and-restore").parents("li").addClass('active');
            break;
        case "mifi-system-settings-software-update.html":
            $("#mifi-system-settings-software-update").addClass('active');
            $("#mifi-system-settings-software-update").parents("li").addClass('active');
            break;
        case "mifi-system-settings-reset-default.html":
            $("#mifi-system-settings-reset-default").addClass('active');
            $("#mifi-system-settings-reset-default").parents("li").addClass('active');
            break;
        case "mifi-system-settings-reboot.html":
            $("#mifi-system-settings-reboot").addClass('active');
            $("#mifi-system-settings-reboot").parents("li").addClass('active');
            break;


        case "mifi-about.html":
            $("#mifi-about").addClass('active');
            break;

    }
}

function menu_ctl() {

    var menu = checkSession();
    switch (menu) {
        case "on":
            $("#mifi-connected-clients").show();
            $("#mifi-settings").show();
            break;
        // ===============================
        case "off":
            $("#mifi-connected-clients").hide();
            $("#mifi-settings").hide();
            break;
    }
}

function checkSession() {
    if (session_token) {
        return 'on';
    } else {
        return 'off';
    }
}


function showLoginSection() {
    $("#loginSection").show();
    $("#userMenu").hide();
    // $("#m-logo").removeClass('d-sm-none');
}

function showUserMenu() {
    $("#userMenu").show();
    $("#loginSection").hide();

}

function userLogout() {
    $.LoadingOverlay("show");
    var timeout_update = Session_inactivity_timeout * 60;

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAutoRebootConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                //alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                //alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                //alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                //alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_auth",
                    data: {
                        type: "close",
                        timeout: timeout_update
                    },
                    dataType: "text",
                    success: function (msgs) {
                        $.LoadingOverlay("hide");
                        if (msgs.length > 0) {
                            clearSession();
                        }
                    }
                });
            }
        }
    });
}

function getDeviceInfoIndex(callFunc1, callFunc2, callFunc3) {
    //getBatteryIcon(20);
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    if (!callFunc3) callFunc3 = null;
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetHomeDeviceInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                var _obj = obj

                getSignalIcon(_obj.HomeResult, _obj.SignalStatus, _obj.SignalStrength);
                getConnectIcon(_obj.SignalStatus, _obj.ConnectStatus);
                // getBatteryIcon(_obj.BatteryStatus, _obj.BatteryCapacity);

                if (_obj.SignalStatus != "1" && _obj.SignalStatus != "2") {
                    $("#ConnectStatus").html('<span data-locale="home.Disconnected">' + $.i18n.prop("home.Disconnected") + '</span>');
                    localStorage.setItem('ConnectStatus', "");
                    $("#home_network").text("");
                } else {
                    $("#ConnectStatus").html('<span data-locale="home.Connected">' + $.i18n.prop("home.Connected") + '</span>');
                    localStorage.setItem('ConnectStatus', "Connected");
                    switch (_obj.ConnectStatus) {
                        case "4":
                            $("#home_network").text("5G");
                            localStorage.setItem('ConnectStatus', '5G');
                            break;
                        case "3":
                            $("#home_network").text("4G+");
                            localStorage.setItem('ConnectStatus', '4G+');
                            break;
                        case "2":
                            $("#home_network").text("3G");
                            localStorage.setItem('ConnectStatus', '3G');
                            break;
                        default:
                            break;
                    }
                }
                connectTimeDisplay(_obj.ConnectTime);
                $("#home_lan_ip_address").text(_obj.LanIP);
                $("#home_lan_mac_address").text(_obj.LanMAC);
                $("#home_wan_ip_address").text(_obj.WanIP);
                $("#home_wan_ipv6_address").text(_obj.WanIPV6);
                $("#home_VPNPassthrough").text(getVPNPassthrough(_obj));
                $("#home_Ethernet_address").text(_obj.EthernetMac);
                $("#home_wan_ipdns_address").text(_obj.DnsIP);
                $("#home_ipv6dns_address").text(_obj.DnsIPV6);

                if (_obj.EthernetStatus == 1) {
                    $(".ethernet_icon").show()
                }
                switch(String(_obj.NewUpdateNotice)) {
                    case "1":
                        $(".notification_icon").show();
                    break;
                    case "2":
                        $(".downloading_icon").show();
                    break;  
                    default:
                    break;
                }


                if(_obj.NowDateTime) {
                    if( _obj.use24Format && String(_obj.use24Format)=="1") { //24 format
                        var NowDateTime = _obj.NowDateTime.substring(0, _obj.NowDateTime.length - 3);
                        $("#NowDateTime").html(NowDateTime);
                    }else { //12 format
                        var NowDateTime = _obj.NowDateTime;
                        var temp = NowDateTime.split(" ");
                        var temp2 = temp[1].split(":");
                        var hour = temp2[0];
                        var hourMinute = temp[1].substring(0, temp[1].length - 3);
                        var dateTimeString = '';
                        if(hour<=12) {
                            dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jam">'+$.i18n.prop("datetimeHour.jam")+'</span>'+hourMinute+'<span data-locale="datetimeHour.am">'+$.i18n.prop("datetimeHour.am")+'</span>';
                        }else {
                            hour = ('0'+(parseInt(hour)-12)).slice(-2);
                            hourMinute = hour + ':' + temp2[1];
                            dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jpm">'+$.i18n.prop("datetimeHour.jpm")+'</span>'+hourMinute+'<span data-locale="datetimeHour.pm">'+$.i18n.prop("datetimeHour.pm")+'</span>';
                        }
                        $("#NowDateTime").html(dateTimeString);
                    }
                }

                localStorage.setItem('NetworkName', _obj.NetworkName);
                localStorage.setItem('SignalStatus', _obj.SignalStatus);
                localStorage.setItem('MCC', _obj.MCC);

                setTimeout(function (){
                  // Something you want delayed.
                    $(".form-control:not(.show-password)").show();
                    $(".custom-switch").show();
                    $(".custom-checkbox").show();
                }, 200); // How long do you want the delay to be (in milliseconds)? 

                if (callFunc1) {
                    if (callFunc2) {
                        if (callFunc3) {
                            callFunc1(callFunc2, callFunc3);
                        } else {
                            callFunc1(callFunc2);
                        }
                    } else {
                        callFunc1();
                    }
                }

                return;
                //}
            } 
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function getDeviceInfo(callFunc1, callFunc2, callFunc3) {
    //getBatteryIcon(20);
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    if (!callFunc3) callFunc3 = null;
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetHomeDeviceInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                var _obj = obj

                getSignalIcon(_obj.HomeResult, _obj.SignalStatus, _obj.SignalStrength);
                getConnectIcon(_obj.SignalStatus, _obj.ConnectStatus);
                // getBatteryIcon(_obj.BatteryStatus, _obj.BatteryCapacity);


                if (_obj.EthernetStatus == 1) {
                    $(".ethernet_icon").show()
                }
                switch(String(_obj.NewUpdateNotice)) {
                    case "1":
                        $(".notification_icon").show();
                    break;
                    case "2":
                        $(".downloading_icon").show();
                    break;  
                    default:
                    break;
                }


                if(_obj.NowDateTime) {
                    if( _obj.use24Format && String(_obj.use24Format)=="1") { //24 format
                        var NowDateTime = _obj.NowDateTime.substring(0, _obj.NowDateTime.length - 3);
                        $("#NowDateTime").html(NowDateTime);
                    }else { //12 format
                        var NowDateTime = _obj.NowDateTime;
                        var temp = NowDateTime.split(" ");
                        var temp2 = temp[1].split(":");
                        var hour = temp2[0];
                        var hourMinute = temp[1].substring(0, temp[1].length - 3);
                        var dateTimeString = '';
                        if(hour<=12) {
                            dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jam">'+$.i18n.prop("datetimeHour.jam")+'</span>'+hourMinute+'<span data-locale="datetimeHour.am">'+$.i18n.prop("datetimeHour.am")+'</span>';
                        }else {
                            hour = ('0'+(parseInt(hour)-12)).slice(-2);
                            hourMinute = hour + ':' + temp2[1];
                            dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jpm">'+$.i18n.prop("datetimeHour.jpm")+'</span>'+hourMinute+'<span data-locale="datetimeHour.pm">'+$.i18n.prop("datetimeHour.pm")+'</span>';
                        }
                        $("#NowDateTime").html(dateTimeString);
                    }
                }

                localStorage.setItem('NetworkName', _obj.NetworkName);
                localStorage.setItem('SignalStatus', _obj.SignalStatus);
                localStorage.setItem('MCC', _obj.MCC);

                setTimeout(function (){
                  // Something you want delayed.
                    $(".form-control:not(.show-password)").show();
                    $(".custom-switch").show();
                    $(".custom-checkbox").show();
                }, 200); // How long do you want the delay to be (in milliseconds)? 

                if (callFunc1) {
                    if (callFunc2) {
                        if (callFunc3) {
                            callFunc1(callFunc2, callFunc3);
                        } else {
                            callFunc1(callFunc2);
                        }
                    } else {
                        callFunc1();
                    }
                }

                return;
                //}
            } 
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function getHomeInfo(callFunc1, callFunc2) {
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetHomeDeviceInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                var _obj = obj
                if (_obj.SignalStatus != "1" && _obj.SignalStatus != "2") {
                    $("#ConnectStatus").html('<span data-locale="home.Disconnected">' + $.i18n.prop("home.Disconnected") + '</span>');
                    localStorage.setItem('ConnectStatus', "");
                    $("#home_network").text("");
                } else {
                    $("#ConnectStatus").html('<span data-locale="home.Connected">' + $.i18n.prop("home.Connected") + '</span>');
                    localStorage.setItem('ConnectStatus', "Connected");
                    switch (_obj.ConnectStatus) {
                        case "4":
                            $("#home_network").text("5G");
                            localStorage.setItem('ConnectStatus', '5G');
                            break;
                        case "3":
                            $("#home_network").text("4G+");
                            localStorage.setItem('ConnectStatus', '4G+');
                            break;
                        case "2":
                            $("#home_network").text("3G");
                            localStorage.setItem('ConnectStatus', '3G');
                            break;
                        default:
                            break;
                    }
                }
                connectTimeDisplay(_obj.ConnectTime);
                $("#home_lan_ip_address").text(_obj.LanIP);
                $("#home_lan_mac_address").text(_obj.LanMAC);
                $("#home_wan_ip_address").text(_obj.WanIP);
                $("#home_wan_ipv6_address").text(_obj.WanIPV6);
                $("#home_VPNPassthrough").text(getVPNPassthrough(_obj));
                $("#home_Ethernet_address").text(_obj.EthernetMac);
                $("#home_wan_ipdns_address").text(_obj.DnsIP);
                $("#home_ipv6dns_address").text(_obj.DnsIPV6);

                if (callFunc1) {
                    if (callFunc2) {
                        callFunc1(callFunc2);
                    } else {
                        callFunc1();
                    }
                }
                return;
            } 
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function getBatteryIcon(BatteryStatus, BatteryCapacity) {
    var icon = '';
    if (BatteryStatus == "Charging") {
        $(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_charging.svg");
        $(".battery_icon").show();
    } else {
        var x = BatteryCapacity;
        switch (true) {
            case (x < 10):
                $(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_20.svg");
                $(".battery_icon").show();
                break;
            case (x <= 29):
                $(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_40.svg");
                $(".battery_icon").show();
                break;
            case (x <= 49):
                $(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_60.svg");
                $(".battery_icon").show();
                break;
            case (x <= 69):
                $(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_80.svg");
                $(".battery_icon").show();
                break;
            case (x <= 100):
                $(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_full.svg");
                $(".battery_icon").show();
                break;
            default:
                $(".battery_icon").hide();
                //$(".battery_icon").attr("src", "assets/img/5g_status/ic_status_power_full.svg");
                break;
        }
    }
}

function getSignalIcon(HomeResult, SignalStatus, SignalStrength) {

    // typedef struct
    // {
    //     boolean isRegistered;
    //     boolean isRoaming;
    //     mifi_qmi_nas_rat radioTech;
    //     nas_plmn_type_v01 plmn;
    // }

    // typedef enum
    // {
    //     SIG_UNKNOWN,
    //     SIG_POOR, //1
    //     SIG_MODERATE,
    //     SIG_GOOD,
    //     SIG_GREAT,
    //     SIG_EXCELLENT,
    // } => Json: SignalStatus =>  0=not Registered, 1=Registered not Roaming, 2= Registered and Roaming
    var lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'jp';
    var icon = "";
    // if (HomeResult == "INTERNAL ERROR") //No SIM
    // {
    //     icon = "assets/img/5g_status/ic_status_no_signal.svg";
    //     localStorage.setItem('ConnectStatus', $.i18n.prop("home.Nosignal"));
    // } else {
    switch (SignalStatus) { // out of service
        case "0":
            //icon = "assets/img/5g_status/ic_status_signal_out_service.svg";

            switch (lang) {
                case "jp":
                    icon = "assets/img/5g_status/ic_status_signal_out_service_jp.svg";
                    break;
                default:
                    icon = "assets/img/5g_status/ic_status_signal_out_service_en.svg";
                    break;
            }
            break;
        case "2": //roaming
            //icon = "assets/img/5g_status/ic_status_signal_roaming.svg";
            switch (SignalStrength) {
                case "1":
                    icon = "assets/img/5g_status/ic_status_signal_roaming_1.svg";
                    break;
                case "2":
                    icon = "assets/img/5g_status/ic_status_signal_roaming_2.svg";
                    break;
                case "3":
                    icon = "assets/img/5g_status/ic_status_signal_roaming_3.svg";
                    break;
                case "4":
                    icon = "assets/img/5g_status/ic_status_signal_roaming_full.svg";
                    break;
            }
            break;
        case "3":
            switch (lang) {
                case "jp":
                    icon = "assets/img/5g_status/ic_status_signal_out_service_jp.svg";
                    break;
                default:
                    icon = "assets/img/5g_status/ic_status_signal_out_service_en.svg";
                    break;
            }
            break;
        case "4": //search
            icon = "assets/img/5g_status/ic_status_signal_searching.svg";
            break;
    }
    // }
    if (icon == "") {
        switch (SignalStrength) { //1=Registered not Roaming
            case "1":
                icon = "assets/img/5g_status/ic_status_signal_40.svg";
                break;
            case "2":
                icon = "assets/img/5g_status/ic_status_signal_60.svg";
                break;
            case "3":
                icon = "assets/img/5g_status/ic_status_signal_80.svg";
                break;
            case "4":
                icon = "assets/img/5g_status/ic_status_signal_full.svg";
                break;
        }
    }

    if (icon == "") {
        $(".signal_icon").hide();
    } else {
        $(".signal_icon").attr("src", icon);
        $(".signal_icon").show();
    }
}

function getConnectIcon(SignalStatus, ConnectStatus) {

    // typedef enum
    // {
    //     RAT_NONE,
    //     RAT_GSM,
    //     RAT_WCDMA,
    //     RAT_LTE,
    //     RAT_NR5G,
    //     RAT_MAX
    // }
    if (SignalStatus != "1" && SignalStatus != "2") {
        $(".connect_icon").hide();
        localStorage.setItem('ConnectStatus', "");
    } else {
        switch (ConnectStatus) {
            // case "3":
            //   //alert("less than five");
            //   $(".connect_icon").attr("src", "assets/img/5g_status/ic_status_lte.svg");
            //   $(".connect_icon").show();
            //   break;
            case "4":
                $(".connect_icon").attr("src", "assets/img/5g_status/ic_status_5g.svg");
                $(".connect_icon").show();
                localStorage.setItem('ConnectStatus', '5G');
                break;
            case "3":
                $(".connect_icon").attr("src", "assets/img/5g_status/ic_status_4g_plus.svg");
                $(".connect_icon").show();
                localStorage.setItem('ConnectStatus', '4G+');
                break;
            case "2":
                $(".connect_icon").attr("src", "assets/img/5g_status/ic_status_3g.svg");
                $(".connect_icon").show();
                localStorage.setItem('ConnectStatus', '3G');
                break;
            default:
                //$(".connect_icon").hide();
                //localStorage.setItem('ConnectStatus', $.i18n.prop("home.Nosignal"));
                break;
        }
    }
}

function getVPNPassthrough(obj) {
    var str = "";
    if (obj.PPTP == 1) {
        str += "PPTP,";
    }
    if (obj.L2TP == 1) {
        str += "L2TP,";
    }
    if (obj.IPSEC == 1) {
        str += "IPSec,";
    }
    return str.slice(0, -1);
}

function RefreshWLANSettings(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetLanConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.lan_config_result == "SUCCESS") {
                // Host IP Address
                var lan_gw_addrs_tokens = obj.lan_gw_addrs.split(".");
                $("#Text_LAN_GWIP_3").val(lan_gw_addrs_tokens[2]);
                $("#Text_LAN_GWIP_4").val(lan_gw_addrs_tokens[3]);
                // Host Subnet Mask
                var lan_sub_tokens = obj.lan_sub.split(".");
                $("#Text_LAN_SUB_3").val(lan_sub_tokens[2]);
                $("#Text_LAN_SUB_4").val(lan_sub_tokens[3]);
                // Start IP address
                var lan_dhcp_start_tokens = obj.lan_dhcp_start.split(".");
                //$("#Text_LAN_DHCP_START_IP_3").val(lan_dhcp_start_tokens[2]);
                
                $("#Text_LAN_DHCP_START_IP_3").val(lan_dhcp_start_tokens[2]);
                $("#Text_LAN_DHCP_START_IP_4").val(lan_dhcp_start_tokens[3]);
                // End IP address
                var lan_dhcp_end_tokens = obj.lan_dhcp_end.split(".");
                //$("#Text_LAN_DHCP_END_IP_3").val(lan_dhcp_end_tokens[2]);
                
                $("#Text_LAN_DHCP_END_IP_3").val(lan_dhcp_end_tokens[2]);
                $("#Text_LAN_DHCP_END_IP_4").val(lan_dhcp_end_tokens[3]);

                switch (String(obj.lan_dhcp)) {
                    case "0":
                        $("#Select_LAN_DHCP option[value='0']").prop('selected', true);
                        break;
                    case "1":
                        $("#Select_LAN_DHCP option[value='1']").prop('selected', true);
                        break;
                }

                switch (String(obj.static_dns_enable)) {
                    case "0":
                        $("#Select_static_dns_enable option[value='0']").prop('selected', true);
                        $(".dns_input").prop('disabled', true);
                        break;
                    case "1":
                        $("#Select_static_dns_enable option[value='1']").prop('selected', true);
                        $(".dns_input").prop('disabled', false);
                        findKittyKey('DhcpServerSetting_PrimaryDns', 'primary_dns_1');
                        findKittyKey('DhcpServerSetting_PrimaryDns', 'primary_dns_2');
                        findKittyKey('DhcpServerSetting_PrimaryDns', 'primary_dns_3');
                        findKittyKey('DhcpServerSetting_PrimaryDns', 'primary_dns_4');
                        findKittyKey('DhcpServerSetting_SecondaryDns', 'secondary_dns_1');
                        findKittyKey('DhcpServerSetting_SecondaryDns', 'secondary_dns_2');
                        findKittyKey('DhcpServerSetting_SecondaryDns', 'secondary_dns_3');
                        findKittyKey('DhcpServerSetting_SecondaryDns', 'secondary_dns_4');

                        break;
                }
                var lan_dhcp_lease = parseInt(obj.lan_dhcp_lease) / 60;
                $("#Text_LAN_DHCP_LEASE").val(lan_dhcp_lease);

                if(obj.static_dns_pri=="0.0.0.0") {
                    $("#primary_dns_1").val('');
                    $("#primary_dns_2").val('');
                    $("#primary_dns_3").val('');
                    $("#primary_dns_4").val('');
                }else {
                    var static_dns_pri_tokens = obj.static_dns_pri.split(".");
                    $("#primary_dns_1").val(static_dns_pri_tokens[0]);
                    $("#primary_dns_2").val(static_dns_pri_tokens[1]);
                    $("#primary_dns_3").val(static_dns_pri_tokens[2]);
                    $("#primary_dns_4").val(static_dns_pri_tokens[3]);
                }

                if(obj.static_dns_sec=="0.0.0.0") {
                    $("#secondary_dns_1").val('');
                    $("#secondary_dns_2").val('');
                    $("#secondary_dns_3").val('');
                    $("#secondary_dns_4").val('');
                }else {
                    var static_dns_sec_tokens = obj.static_dns_sec.split(".");
                    $("#secondary_dns_1").val(static_dns_sec_tokens[0]);
                    $("#secondary_dns_2").val(static_dns_sec_tokens[1]);
                    $("#secondary_dns_3").val(static_dns_sec_tokens[2]);
                    $("#secondary_dns_4").val(static_dns_sec_tokens[3]);
                }


                //KittyLock
                findKittyKey('LanSetting_HostIpAddress', 'Text_LAN_GWIP_3');
                findKittyKey('LanSetting_HostIpAddress', 'Text_LAN_GWIP_4');
                findKittyKey('LanSetting_HostSubnetMask', 'Text_LAN_SUB_3');
                findKittyKey('LanSetting_HostSubnetMask', 'Text_LAN_SUB_4');
                findKittyKey('DhcpServerSetting_DhcpServer', 'Select_LAN_DHCP');
                //findKittyKey('DhcpServerSetting_StartIpAddress', 'Text_LAN_DHCP_START_IP_3');
                findKittyKey('DhcpServerSetting_StartIpAddress', 'Text_LAN_DHCP_START_IP_4');
                //findKittyKey('DhcpServerSetting_EndIpAddress', 'Text_LAN_DHCP_END_IP_3');
                findKittyKey('DhcpServerSetting_EndIpAddress', 'Text_LAN_DHCP_END_IP_4');

                findKittyKey('DhcpServerSetting_LeaseTime', 'Text_LAN_DHCP_LEASE');
                findKittyKey('DhcpServerSetting_DnsSettings', 'Select_static_dns_enable');

                if (callFunc1) {
                    callFunc1();
                }

            } else {
                alert(obj.lan_config_result);
            }
            changedvalues = 0;

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function UpdateWLANSettings() {

    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var lan_dhcp, lan_dhcp_lease, lan_gw_addrs, lan_dhcp_start, lan_dhcp_end, lan_sub, static_dns_pri, static_dns_sec, static_dns_enable;
    static_dns_pri = $("#primary_dns_1").val() + '.' + $("#primary_dns_2").val() + '.' + $("#primary_dns_3").val() + '.' + $("#primary_dns_4").val();
    static_dns_sec = $("#secondary_dns_1").val() + '.' + $("#secondary_dns_2").val() + '.' + $("#secondary_dns_3").val() + '.' + $("#secondary_dns_4").val();
    lan_dhcp_lease = parseInt($("#Text_LAN_DHCP_LEASE").val()) * 60;
    lan_dhcp = $("#Select_LAN_DHCP").val();
    static_dns_enable = $("#Select_static_dns_enable").val();
    lan_gw_addrs = '192.168.' + $("#Text_LAN_GWIP_3").val() + '.' + $("#Text_LAN_GWIP_4").val();
    lan_sub = '255.255.' + $("#Text_LAN_SUB_3").val() + '.' + $("#Text_LAN_SUB_4").val();
    lan_dhcp_start = '192.168.' + $("#Text_LAN_DHCP_START_IP_3").val() + '.' + $("#Text_LAN_DHCP_START_IP_4").val();
    lan_dhcp_end = '192.168.' + $("#Text_LAN_DHCP_END_IP_3").val() + '.' + $("#Text_LAN_DHCP_END_IP_4").val();
    if (static_dns_pri == "...") static_dns_pri = "0.0.0.0";
    if (static_dns_sec == "...") static_dns_sec = "0.0.0.0";

    var temp = {
        Page: "SetLanDHCPConfig",
        Mask: 3,
        lan_dhcp: lan_dhcp,
        lan_gw_addrs: lan_gw_addrs,
        lan_sub: lan_sub,
        lan_dhcp_start: lan_dhcp_start,
        lan_dhcp_end: lan_dhcp_end,
        lan_dhcp_lease: lan_dhcp_lease,
        static_dns_enable: static_dns_enable,
        static_dns_pri: static_dns_pri,
        static_dns_sec: static_dns_sec,
        token: session_token
    };
    var flag = dhcp_change_check();
    //var flag_submask = dhcp_submask_check();
    //flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetLanDHCPConfig",
                Mask: 3,
                lan_dhcp: lan_dhcp,
                lan_gw_addrs: lan_gw_addrs,
                lan_sub: lan_sub,
                lan_dhcp_start: lan_dhcp_start,
                lan_dhcp_end: lan_dhcp_end,
                lan_dhcp_lease: lan_dhcp_lease,
                static_dns_enable: static_dns_enable,
                static_dns_pri: static_dns_pri,
                static_dns_sec: static_dns_sec,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {

                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket TimeOut") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }     
                             
                if (obj.lan_config_result != "SUCCESS") {
                    if (obj.lan_config_result == "INVALID OPERATION") {
                        $.LoadingOverlay("hide");
                        //Reserved IP address duplicated with existing one. Please check again.
                        //$("#addReserveIPAddress").modal('show');
                        $("#applyDHCPDisconnectModal").modal('hide');                    
                        alert($.i18n.prop("error.ReservedIPaddressoutofrange"));
                        return;
                    }  
                } else {
                    $("#lan_dhcp").val(lan_dhcp);
                    $("#lan_gw_addrs").val(lan_gw_addrs);
                    $("#lan_sub").val(lan_sub);
                    $("#lan_dhcp_start").val(lan_dhcp_start);
                    $("#lan_dhcp_end").val(lan_dhcp_end);
                    $("#lan_dhcp_lease").val(lan_dhcp_lease);
                    $("#static_dns_enable").val(static_dns_enable);
                    $("#static_dns_pri").val(static_dns_pri);
                    $("#static_dns_sec").val(static_dns_sec);

                    SetActivateLAN();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $.LoadingOverlay("hide");
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                changedvalues = 0;
                location.reload();
            }
        });

    } else {
        $.LoadingOverlay("hide");
    }
}

function SetActivateLAN() {
    //$.LoadingOverlay("show");
    var Error_Msg = "";
    // var checkLogin = checkSession();
    // if (checkLogin == "off") {
    //   backToHome();
    //   return false;
    // }
    var lan_dhcp, lan_gw_addrs, lan_sub, lan_dhcp_start, lan_dhcp_end, lan_dhcp_lease, static_dns_enable, static_dns_pri, static_dns_sec;
    // $("#Text_LAN_GWIP").val('192.168.' + $("#Text_LAN_GWIP_3").val() + '.' + $("#Text_LAN_GWIP_4").val());
    // $("#Text_LAN_SUB").val('255.255.' + $("#Text_LAN_SUB_3").val() + '.' + $("#Text_LAN_SUB_4").val());
    // $("#Text_LAN_DHCP_START_IP").val('192.168.' + $("#Text_LAN_DHCP_START_IP_3").val() + '.' + $("#Text_LAN_DHCP_START_IP_4").val());
    // $("#Text_LAN_DHCP_END_IP").val('192.168.' + $("#Text_LAN_DHCP_END_IP_3").val() + '.' + $("#Text_LAN_DHCP_END_IP_4").val());

    lan_dhcp = $("#lan_dhcp").val();
    lan_gw_addrs = $("#lan_gw_addrs").val();
    lan_sub = $("#lan_sub").val();
    lan_dhcp_start = $("#lan_dhcp_start").val();
    lan_dhcp_end = $("#lan_dhcp_end").val();
    lan_dhcp_lease = $("#lan_dhcp_lease").val();
    static_dns_enable = $("#static_dns_enable").val();
    static_dns_pri = $("#static_dns_pri").val();
    static_dns_sec = $("#static_dns_sec").val();


    // if ($("#Select_LAN_DHCP").prop('checked')) {
    //   lan_dhcp = 1;
    // } else {
    //   lan_dhcp = 0;
    // }
    var temp = {
        Page: "SetActivateLAN",
        Mask: 0,
        lan_dhcp: lan_dhcp,
        lan_gw_addrs: lan_gw_addrs,
        lan_sub: lan_sub,
        lan_dhcp_start: lan_dhcp_start,
        lan_dhcp_end: lan_dhcp_end,
        lan_dhcp_lease: lan_dhcp_lease,
        static_dns_enable: static_dns_enable,
        static_dns_pri: static_dns_pri,
        static_dns_sec: static_dns_sec,
        token: session_token
    };
    //var flag = dhcp_change_check();
    var flag = true;
    //flag = false ;
    if (flag) {
        //$.LoadingOverlay("hide");
        var token = session_token;
        // alert($.i18n.prop("confirm.logout"))
        //clearSessionNoJump();
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetActivateLAN",
                Mask: 0,
                lan_dhcp: lan_dhcp,
                lan_gw_addrs: lan_gw_addrs,
                lan_sub: lan_sub,
                lan_dhcp_start: lan_dhcp_start,
                lan_dhcp_end: lan_dhcp_end,
                lan_dhcp_lease: lan_dhcp_lease,
                static_dns_enable: static_dns_enable,
                static_dns_pri: static_dns_pri,
                static_dns_sec: static_dns_sec,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                
                //alert('The router will logout the WebUI, please login again after later.')
                //location.reload();
            }
        });
        indexSessionCheckToServer = self.setInterval("dhcpSessionCheckToServer()", 5000); // 5 seconds check again
        //clearSession();
    } else {
        $.LoadingOverlay("hide");
        //alert('please check input again')
    }
}


function clearSession() {

    // $.LoadingOverlay("show");
    // var timeout_update = Session_inactivity_timeout * 60;
    delete_cookie("session_token");
    // localStorage.removeItem("session_token")
    localStorage.removeItem("updatePWD")
    localStorage.removeItem("Locks")
    Session_inactivity_timeout = 10;
    session_token = "";
    location.href = "index.html";    
    // $.ajax({
    //     type: "POST",
    //     url: "../../cgi-bin/qcmap_auth",
    //     data: {
    //         type: "close",
    //         timeout: timeout_update
    //     },
    //     dataType: "text",
    //     success: function (msgs) {
    //         $.LoadingOverlay("hide");
    //         if (msgs.length > 0) {
    //             localStorage.removeItem("session_token")
    //             localStorage.removeItem("updatePWD")
    //             localStorage.removeItem("Locks")
    //             Session_inactivity_timeout = 5;
    //             session_token = "";
    //             location.href = "index.html";
    //         } else {
    //             alert($.i18n.prop("error.NoReplyfromservert"));
    //         }
    //     }
    // });
}

function clearSessionNoJump() {
    localStorage.removeItem("session_token")
    localStorage.removeItem("updatePWD")
    localStorage.removeItem("Locks")
    Session_inactivity_timeout = 10;
    session_token = "";
    // var timeout_update = Session_inactivity_timeout * 60;
    // $.ajax({
    //     type: "POST",
    //     url: "../../cgi-bin/qcmap_auth",
    //     data: {
    //         type: "close",
    //         timeout: timeout_update
    //     },
    //     dataType: "text",
    //     success: function (msgs) {
    //         if (msgs.length > 0) {
    //             localStorage.removeItem("session_token")
    //             localStorage.removeItem("updatePWD")
    //             Session_inactivity_timeout = 5;
    //             session_token = "";
    //             //location.href = "index.html";
    //         } else {
    //             alert($.i18n.prop("error.NoReplyfromservert"));
    //         }
    //     }
    // });

}

function clearClientSessionNoJump() {
    localStorage.removeItem("session_token")
    localStorage.removeItem("updatePWD")
    localStorage.removeItem("Locks")
    Session_inactivity_timeout = 10;
    session_token = "";
}


function GetMediaSharingStatus() {
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetMediaSharingStatus",
            mask: "7",
            upnp_enable: "99",
            upnp_result: "0",
            dlna_enable: "99",
            dlna_result: "0",
            mdns_enable: "99",
            mdns_result: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.upnp_result == "SUCCESS") {
                    
                    if (obj.upnp_enable == "2") {
                        $("#Select_UPNP_EN_DS option[value=2]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('on');
                    } else if (obj.upnp_enable == "1") {
                        $("#Select_UPNP_EN_DS option[value=1]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('off');
                    }
                    $("#Select_DLNA_EN_DS").val(obj.dlna_enable);
                    $("#Select_MDNS_EN_DS").val(obj.mdns_enable);
                    //KittyLock
                    findKittyKey('Upnp', 'Select_UPNP_EN_DS');
                    findKittyKey('Upnp', 'upnp_lock');
                }
                
            }
        }
    });

}

function SetMediaSharingStatus() {
    $.LoadingOverlay("show");
    var upnp_enable = $("#Select_UPNP_EN_DS").val();
    var dlna_enable = $("#Select_DLNA_EN_DS").val();
    var mdns_enable = $("#Select_MDNS_EN_DS").val();
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetMediaSharingStatus",
            mask: "1",
            upnp_result: "0",
            upnp_enable: upnp_enable,
            dlna_result: "0",
            dlna_enable: dlna_enable,
            mdns_result: "0",
            mdns_enable: mdns_enable,         
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.upnp_result == "SUCCESS") {
                    
                    alert($.i18n.prop("success.message"));
                    location.reload();
                }
                
            }
        }
    });

}

function RefreshEntries(values) {
    if (!values) values = 1;
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var error_msg = "";
    var upnp_enable = "";
    if (values == 1) {
        pagetag = "GetMediaSharingStatus";
        changedvalues = 7;
    } else {
        pagetag = "SetMediaSharingStatus";
        upnp_enable = $("#Select_UPNP_EN_DS").val();
    }
    if ($("#Select_UPNP_EN_DS").val() != UPNP_EN_DS_OLD)
        changedvalues = changedvalues | 1;
    if ($("#Select_DLNA_EN_DS").val() != DLNA_EN_DS_OLD)
        changedvalues = changedvalues | 2;
    if ($("#Select_MDNS_EN_DS").val() != MDNS_EN_DS_OLD)
        changedvalues = changedvalues | 4;

    
    // if ($("#Select_UPNP_EN_DS").prop('checked')) {
    //   upnp_enable = 1;
    // } else {
    //   upnp_enable = 2;
    // }
    if(values==2) {
        $.LoadingOverlay("show");
    }

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: pagetag,
            mask: changedvalues,
            upnp_result: "0",
            upnp_enable: upnp_enable,
            dlna_result: "0",
            dlna_enable: $("#Select_DLNA_EN_DS").val(),
            mdns_result: "0",
            mdns_enable: $("#Select_MDNS_EN_DS").val(),
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if ((obj.upnp_result != "SUCCESS") && (changedvalues & 1 == 1)) {
                    //alert("Failed to Update")
                    //$("#Label_UPNP_EN_DS").text("Failed to Update");
                    error_occured = 1;
                    $("#Select_UPNP_EN_DS").val(UPNP_EN_DS_OLD);
                    error_msg = error_msg + "\n" + "UPNP Enable : " + obj.upnp_result;
                } else {
                    UPNP_EN_DS_OLD = UPNP_EN_DS = obj.upnp_enable;
                    if (obj.upnp_enable == "1") {
                        $("#Select_UPNP_EN_DS option[value=1]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('on');
                    } else if (obj.upnp_enable == "2") {
                        $("#Select_UPNP_EN_DS option[value=2]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('off');
                    }
                    //KittyLock
                    findKittyKey('Upnp', 'Select_UPNP_EN_DS');
                    findKittyKey('Upnp', 'upnp_lock');
                    //$("#Select_UPNP_EN_DS").val(UPNP_EN_DS);
                    //$("#Label_UPNP_EN_DS").text("");
                }
                if ((obj.dlna_result != "SUCCESS") && (changedvalues & 2 == 2)) {
                    //alert("Failed to Update")
                    //$("#Label_DLNA_EN_DS").text("Failed to Update");
                    error_occured = 1;
                    $("#Select_DLNA_EN_DS").val(DLNA_EN_DS_OLD);
                    error_msg = error_msg + "\n" + "DLNA Enable : " + obj.dlna_result;
                } else {
                    DLNA_EN_DS_OLD = DLNA_EN_DS = obj.dlna_enable;
                    $("#Select_DLNA_EN_DS").val(DLNA_EN_DS);
                    //$("#Label_DLNA_EN_DS").text("");
                }
                if ((obj.mdns_result != "SUCCESS") && (changedvalues & 4 == 4)) {
                    //alert("Failed to Update")
                    //$("#Label_MDNS_EN_DS").text("Failed to Update");
                    error_occured = 1;
                    $("#Select_MDNS_EN_DS").val(MDNS_EN_DS_OLD);
                    error_msg = error_msg + "\n" + "MDNS Enable : " + obj.mdns_result;
                } else {
                    MDNS_EN_DS_OLD = MDNS_EN_DS = obj.mdns_enable;
                    $("#Select_MDNS_EN_DS").val(MDNS_EN_DS);
                    //$("#Label_MDNS_EN_DS").text("");
                }
                if (error_occured == 1) {
                    alert(error_msg);
                } else {
                    if (values != 1) {
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    }
                }
                changedvalues = 0;
            }
        }
    });
    changedvalues = 0;
}

function RefreshNATSettings(commit_type) {
    if (!commit_type) commit_type = 0;
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Page_Type = "";
    var Error_Txt = "";
    var ipsec = "";
    var pptp = "";
    var l2tp = "";
    var flag = true;
    $("#Text_DMZ_IP").val('192.168.' + $("#Text_DMZ_IP_3").val() + '.' + $("#Text_DMZ_IP_4").val());

    if (commit_type == 0) {
        Page_Type = "GetNatSettings";
        changedvalues = 543;
    } else if (commit_type == 1) {
        Page_Type = "SetNatSettings";
        changedvalues = 2;
        var _value2 = $("#Select_DMZ_Status").val();
        if (_value2 == "0") {
            $("#Text_DMZ_IP").val('0.0.0.0')
        } else {
            //ValidateDMZIP($("#Text_DMZ_IP"));
            flag = DMZ_check();
        }

    }
    if (flag) {
        if (commit_type == 1) {
            $.LoadingOverlay("show");
        }
        
        if ($("#Select_IPSEC").prop('checked')) {
            ipsec = 1;
        } else {
            ipsec = 0;
        }
        if ($("#Select_PPTP").prop('checked')) {
            pptp = 1;
        } else {
            pptp = 0;
        }
        if ($("#Select_L2TP").prop('checked')) {
            l2tp = 1;
        } else {
            l2tp = 0;
        }
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: Page_Type,
                mask: changedvalues,
                nattype: $("#Select_NAT_Type").val(),
                nattype_result: "0",
                dmz: $("#Text_DMZ_IP").val(),
                dmz_result: "0",
                ipsec: ipsec,
                ipsec_result: "0",
                pptp: pptp,
                pptp_result: "0",
                l2tp: l2tp,
                l2tp_result: "0",
                gen_timeout: $("#Text_NAT_Gen_TimeOut").val(),
                get_timeout_result: "0",
                icmp_timeout: $("#Text_NAT_ICMP_TimeOut").val(),
                icmp_timeout_result: "0",
                tcp_timeout: $("#Text_NAT_TCP_TimeOut").val(),
                tcp_timeout_result: "0",
                udp_timeout: $("#Text_NAT_UDP_TimeOut").val(),
                udp_timeout_result: "0",
                wwan_access: $("#Select_Webserver_WWAN_Access").val(),
                wwan_access_result: "0",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                if (msgs.length > 0) {
                    var obj = jQuery.parseJSON(msgs);
                    if (obj.result == "AUTH_FAIL") {
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                    }
                    if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                    }
                    if (obj.commit == "Socket Send Error") {
                        clearSession();
                        alert($.i18n.prop("error.SocketSendError"));
                        return;
                    }
                    if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                    }
                    if (commit_type == 0) {
                        if (obj.nattype_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n NAT type : " + obj.nattype_result;
                        } else {
                            Old_NAT_TYPE = obj.nattype;
                            $("#Select_NAT_Type").val(Old_NAT_TYPE);
                        }
                        if (obj.ipsec_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n IPSEC VPN Passthrough : " + obj.ipsec_result;
                        } else {
                            Old_IPSEC = obj.ipsec;
                            $("#Select_IPSEC").val(Old_IPSEC);
                            // if (obj.ipsec == "1") {
                            //   $('#Select_IPSEC').bootstrapToggle('on');
                            // } else if (obj.ipsec == "0") {
                            //   $('#Select_IPSEC').bootstrapToggle('off');
                            // }
                        }
                        if (obj.pptp_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n PPTP VPN Passthrough : " + obj.pptp_result;
                        } else {
                            Old_PPTP = obj.pptp;
                            $("#Select_PPTP").val(Old_PPTP);
                            // if (obj.pptp == "1") {
                            //   $('#Select_PPTP').bootstrapToggle('on');
                            // } else if (obj.pptp == "0") {
                            //   $('#Select_PPTP').bootstrapToggle('off');
                            // }
                        }
                        if (obj.l2tp_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n L2TP VPN Passthrough : " + obj.l2tp_result;
                        } else {
                            Old_L2TP = obj.l2tp;
                            $("#Select_L2TP").val(Old_L2TP);
                            // if (obj.l2tp == "1") {
                            //   $('#Select_L2TP').bootstrapToggle('on');
                            // } else if (obj.l2tp == "0") {
                            //   $('#Select_L2TP').bootstrapToggle('off');
                            // }
                        }
                        if (obj.dmzip_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n DMZ IP : " + obj.dmzip_result;
                            $("#Text_DMZ_IP").val("0.0.0.0");
                        } else {
                            Old_DMZ_IP = obj.dmzip;
                            var tokens = Old_DMZ_IP.split(".");
                            if (Old_DMZ_IP == '0.0.0.0') {
                                $("#Text_DMZ_IP_3").val('');
                                $("#Text_DMZ_IP_4").val('');
                            } else {
                                $("#Text_DMZ_IP_3").val(tokens[2]);
                                $("#Text_DMZ_IP_4").val(tokens[3]);
                            }


                            $("#Text_DMZ_IP").val(Old_DMZ_IP);
                            //$("#OLD_DMZ_status").val();
                            //蛻､譁ｷip豎ｺ螳咼MZ status
                            if (Old_DMZ_IP == '0.0.0.0') {
                                //$('#Select_DMZ_Status').bootstrapToggle('off');
                                $("#Select_DMZ_Status option[value=0]").prop('selected', true);
                                $(".Text_DMZ_IP").prop('disabled', true);
                            } else {
                                //$('#Select_DMZ_Status').bootstrapToggle('on');
                                $("#Select_DMZ_Status option[value=1]").prop('selected', true);
                                $(".Text_DMZ_IP").prop('disabled', false);
                            }

                        }
                        if (obj.gen_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n General Timeout : " + obj.gen_timeout_result;
                        } else {
                            Old_NAT_GEN_TimeOut = obj.gen_timeout;
                            $("#Text_NAT_Gen_TimeOut").val(Old_NAT_GEN_TimeOut);
                        }
                        if (obj.icmp_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n ICMP Timeout : " + obj.icmp_timeout_result;
                        } else {
                            Old_NAT_ICMP_TimeOut = obj.icmp_timeout;
                            $("#Text_NAT_ICMP_TimeOut").val(Old_NAT_ICMP_TimeOut);
                        }
                        if (obj.tcp_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n TCP Timeout : " + obj.tcp_timeout_result;
                        } else {
                            Old_NAT_TCP_TimeOut = obj.tcp_timeout;
                            $("#Text_NAT_TCP_TimeOut").val(Old_NAT_TCP_TimeOut);
                        }
                        if (obj.udp_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n UDP Timeout : " + obj.udp_timeout_result;
                        } else {
                            Old_NAT_UDP_TimeOut = obj.udp_timeout;
                            $("#Text_NAT_UDP_TimeOut").val(Old_NAT_UDP_TimeOut);
                        }
                        if (obj.wwan_access_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n Webserver WWAN Access : " + obj.wwan_access_result;
                        } else {
                            Old_WWAN_ACCESS = obj.wwan_access;
                            $("#Select_Webserver_WWAN_Access").val(Old_WWAN_ACCESS);
                        }
                        if (Error_Txt.length > 0) {
                            Error_Txt = "Get NAT settings failed in the following configurations:\n" + Error_Txt;
                        }
                        //KittyLock
                        findKittyKey('Dmz', 'Select_DMZ_Status');
                        findKittyKey('Dmz', 'dmz_lock');
                    } else if (commit_type == 1) {
                        if (obj.nattype_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n NAT type : " + obj.nattype_result;
                        } else {
                            Old_NAT_TYPE = obj.nattype;
                        }
                        if (obj.ipsec_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n IPSEC VPN Passthrough : " + obj.ipsec_result;
                        } else {
                            Old_IPSEC = obj.ipsec;
                        }
                        if (obj.pptp_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n PPTP VPN Passthrough : " + obj.pptp_result;
                        } else {
                            Old_PPTP = obj.pptp;
                        }
                        if (obj.l2tp_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n L2TP VPN Passthrough : " + obj.l2tp_result;
                        } else {
                            Old_L2TP = obj.l2tp;
                        }
                        if (obj.dmzip_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n DMZ IP : " + obj.dmzip_result;
                        } else {
                            Old_DMZ_IP = obj.dmzip;
                        }
                        if (obj.gen_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n General Timeout : " + obj.gen_timeout_result;
                        } else {
                            Old_NAT_GEN_TimeOut = obj.gen_timeout;
                        }
                        if (obj.icmp_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n ICMP Timeout : " + obj.icmp_timeout_result;
                        } else {
                            Old_NAT_ICMP_TimeOut = obj.icmp_timeout;
                        }
                        if (obj.tcp_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n TCP Timeout : " + obj.tcp_timeout_result;
                        } else {
                            Old_NAT_TCP_TimeOut = obj.tcp_timeout;
                        }
                        if (obj.udp_timeout_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n UDP Timeout : " + obj.udp_timeout_result;
                        } else {
                            Old_NAT_UDP_TimeOut = obj.udp_timeout;
                        }
                        if (obj.wwan_access_result != "SUCCESS") {
                            Error_Txt = Error_Txt + "\n Webserver WWAN Access : " + obj.wwan_access_result;
                        } else {
                            Old_WWAN_ACCESS = obj.wwan_access;
                        }
                        if (Error_Txt.length > 0) {
                            Error_Txt = "Updating NAT settings failed in the following configurations:\n" + Error_Txt;
                        } else {
                            alert($.i18n.prop("success.message"));
                            location.reload();
                        }
                    }
                    changedvalues = "0";
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
        // if (Error_Txt.length > 0) {
        //     alert(Error_Txt);
        // }
    }
}

function UpdatePassword() {
    var timeout_update = $("#Text_TIME_OUT").val() * 60;
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_auth",
        data: {
            type: "update",
            old_pwd: $("#Text_OLD_PWD").val(),
            new_pwd: $("#Text_NEW_PWD").val(),
            timeout: '600',
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "TOKN_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.result == 3) {
                    clearSession();
                    alert($.i18n.prop("error.devicefail"));
                    return;
                }
                if (obj.result == 8 || obj.result == 9 || obj.result == 10 || obj.result == 11 || obj.result == 12 || obj.result == 13) {
                    //loadpage('QCMAP_login.html');
                    alert($.i18n.prop("error.devicefail"));
                    Session_inactivity_timeout = 10;
                    clearSession();
                    return;
                }
                if (obj.result == "5") {
                    alert($.i18n.prop("setting.ui.CurrentPasswordIncorrect"));
                    $("#Text_OLD_PWD").focus();
                    return;
                }
                if (obj.result == "6") {
                    alert($.i18n.prop("setting.ui.newpasswordformat"));
                    $("#Text_NEW_PWD").focus();
                    return;
                }
                if (obj.result == "Error") {
                    alert($.i18n.prop("error.Token_mismatch"));
                    clearSession();
                }
                if (obj.result == "0") {
                    Session_inactivity_timeout = $("#Text_TIME_OUT").val();
                    //loadpage('QCMAP_login.html');
                    alert($.i18n.prop("success.changepassword.loginagain"));
                    clearSession();
                } else {
                    alert($.i18n.prop("error.devicefail"))
                    clearSession();
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function GetAboutPlatformInfo(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAboutPlatformInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            $("#phone_number").text(obj.phone_number);
            //$("#apn").text(obj.current_apn);
            $("#imei").text(obj.imei);
            var firmware_version = obj.model + '_' + obj.major + '_' + obj.minor;
            $("#software_version").text(firmware_version);
            var hardware_version = obj.hwrev;
            $("#system_version").text('01.00.00');
            $("#apn").text(obj.current_apn);
            $("#max_access_number").text(obj.max_access);
            if (!session_token) //No login no show
            {
                $("#phone_section").html('');
                $("#imei_section").html('');
                // $(".locationHistory").hide();
            }
            else {
                $("#phone_section").show();
                $("#imei_section").show();
                // $(".locationHistory").show();
                //getLocationHistory
                // GetLocationHistory();                
            }
            var random = Math.random().toString(16).substring(6);
            $("#csrftoken").val(random);   
            


        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function connectTimeDisplay(second) {
    var input = {
        year: 0,
        month: 0,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: second
    };

    var timestamp = new Date(input.year, input.month, input.day,
        input.hours, input.minutes, input.seconds);

    var interval = 1;

    setInterval(function () {
        timestamp = new Date(timestamp.getTime() + interval * 1000);
        var currentdays = Math.floor(second / (60 * 60 * 24)); 
        currentdays = ("0" + currentdays).slice(-2);        
        var currenthours = timestamp.getHours();
        currenthours = ("0" + currenthours).slice(-2);
        var currentmins = timestamp.getMinutes();
        currentmins = ("0" + currentmins).slice(-2);
        var currentsecs = timestamp.getSeconds();
        currentsecs = ("0" + currentsecs).slice(-2);        
        document.getElementById('ConnectTime').innerHTML = currentdays + ':' + currenthours + ':' + currentmins + ':' + currentsecs ;
    }, Math.abs(interval) * 1000);
}

function GetGlobalWifiConfig(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetGlobalWifiConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.GetGlobalWifiResult == "SUCCESS") {

                // if (obj.Status == 1) {
                //   $('#Select_wifi_status').bootstrapToggle('on');
                // } else if (obj.Status == 0) {
                //   $('#Select_wifi_status').bootstrapToggle('off');
                // }
                switch (String(obj.Status)) {
                    case "1":
                        $("#Select_wifi_status option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_wifi_status option[value=0]").prop('selected', true);
                        break;
                }


                // if (obj.Isolation == 1) {
                //   $('#Select_Isolation').bootstrapToggle('on');
                //   // AP ISOLATION = 1, Access the web interface off and gray
                //   $('#SSID_B_AccessWeb').bootstrapToggle('off');
                //   $("#SSID_B_AccessWeb").prop("disabled", true);            

                // } else if (obj.Isolation == 0) {
                //   $('#Select_Isolation').bootstrapToggle('off');

                // }

                switch (String(obj.Isolation)) {
                    case "1":
                        $("#Select_Isolation option[value=1]").prop('selected', true);
                        //$('#SSID_B_AccessWeb').bootstrapToggle('off');
                        $("#SSID_B_AccessWeb option[value=0]").prop('selected', true);
                        $("#SSID_B_AccessWeb").prop("disabled", true);
                        break;
                    case "0":
                        $("#Select_Isolation option[value=0]").prop('selected', true);
                        break;
                }


                if (obj.ShowSecurity == 1) {
                    $('#Select_ShowSecurity').bootstrapToggle('on');
                } else if (obj.ShowSecurity == 0) {
                    $('#Select_ShowSecurity').bootstrapToggle('off');
                }

                // if (obj.ApMode == 1) {
                //   $('#Select_Multi').bootstrapToggle('on');
                //   $("#Select_Interface option[value='SSID_B']").show();
                // } else if (obj.ApMode == 0) {
                //   $('#Select_Multi').bootstrapToggle('off');
                //   $("#Select_Interface option[value='SSID_B']").hide();
                // }
                select = $("#Select_Interface");
                switch (String(obj.ApMode)) {
                    case "1":
                        $("#Select_Multi option[value=1]").prop('selected', true);
                        select.append("<option value='SSID_B'>SSID B</option>");
                        //$("#Select_Interface option[value='SSID_B']").show();
                        break;
                    case "0":
                        $("#Select_Multi option[value=0]").prop('selected', true);
                        select.find('option[value="SSID_B"]').remove();
                        //$("#Select_Interface option[value='SSID_B']").hide();
                        //$("#Select_Interface").children("option[value='SSID_B']").wrap('<span>').hide();
                        break;
                }


                // $("#Mode").val(obj.Mode);
                $("#Channel24").val(obj.Channel24);
                $("#Bandwidth24").val(obj.Bandwidth24);
                $("#Channel5").val(obj.Channel5);
                $("#Bandwidth5").val(obj.Bandwidth5);
                $("#BandSelection5").val(obj.Bandselection5);
                $("#TxPower").val(obj.TxPower);
                $("#OLD_Select_wifi_status").val(obj.Status);


                if (callFunc1) {
                    callFunc1();
                }

            } else {
                alert(obj.GetGlobalWifiResult);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetGlobalWifiConfig() { 
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var wifi_status, Select_Isolation, Select_ShowSecurity, ApMode, Mode, Channel, Bandwidth;

    //$.LoadingOverlay("show");
    wifi_status = $("#Select_wifi_status").val();
    // if ($("#Select_wifi_status").prop('checked')) {
    //   wifi_status = 1;
    // } else {
    //   wifi_status = 0;
    // }

    Select_Isolation = $("#Select_Isolation").val();
    // if ($("#Select_Isolation").prop('checked')) {
    //   Select_Isolation = 1;
    // } else {
    //   Select_Isolation = 0;
    // }

    if ($("#Select_ShowSecurity").prop('checked')) {
        Select_ShowSecurity = 1;
    } else {
        Select_ShowSecurity = 0;
    }

    ApMode = $("#Select_Multi").val();
    // if ($("#Select_Multi").prop('checked')) {
    //   ApMode = 1;
    // } else {
    //   ApMode = 0;
    // }

    //ApMode = $("#ApMode").val();
    Mode = $("#Mode").val();
    Channel = $("#Channel").val();
    Bandwidth = $("#Bandwidth").val();

    if(Mode == "a")
    {
        door = $("#door").val();
        if (door == "indoor") {
            switch(Channel)
            {
                case "0a":
                    Channel = "53a";
                break;
                default:
                    Channel = "53";
                break;
            }              
        } else {
            switch(Channel)
            {
                case "0a":
                    Channel = "56a";
                break;
                default:
                    Channel = "56";
                break;
            }        
        }
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetGlobalWifiConfig",
            Status: wifi_status,
            ApMode: ApMode,
            Mode: Mode,
            Channel: Channel,
            Bandwidth: Bandwidth,
            Isolation: Select_Isolation,
            ShowSecurity: Select_ShowSecurity,
            SetGlobalWifiResult: "SUCCESS",
            token: session_token,
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                alert($.i18n.prop("common.dfsNotAvailable"));
                return;
            }            
            else if (obj.SetGlobalWifiResult == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                alert(obj.SetGlobalWifiResult);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            //clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetGlobalWifiConfigBasicDFSCancel() {
    //1. The Use Wi-Fi setting returns to the previous setting.
    // 2. If the Wi-Fi Mode settings has not change from enabled, the
    // Wi-Fi Mode settings change to 2.4 GHz
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var ApMode, wifi_status, Select_Isolation, Channel24, Bandwidth24, Channel5, Bandwidth5, BandSelection5, TxPower;

    //$.LoadingOverlay("show");
    wifi_status = $("#Select_wifi_status").val();
    Select_Isolation = $("#Select_Isolation").val();

    ApMode = $("#Select_Multi").val();
    Channel24 = $("#Channel24").val();
    Bandwidth24 = $("#Bandwidth24").val();
    Channel5 = $("#Channel5").val();
    Bandwidth5 = $("#Bandwidth5").val();
    BandSelection5 = $("#BandSelection5").val();
    TxPower = $("#TxPower").val();

    var form = {
        Page: "SetGlobalWifiConfig",
        Status: wifi_status,
        ApMode: ApMode,
        Channel24: Channel24,
        Bandwidth24: Bandwidth24,
        Channel5: Channel5,
        Bandwidth5: Bandwidth5,
        BandSelection5: BandSelection5,
        Isolation: Select_Isolation,
        TxPower: TxPower,
        token: session_token
    };
    //$.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetGlobalWifiConfig",
            Status: wifi_status,
            ApMode: ApMode,
            Channel24: Channel24,
            Bandwidth24: Bandwidth24,
            Channel5: Channel5,
            Bandwidth5: Bandwidth5,
            BandSelection5: BandSelection5,
            Isolation: Select_Isolation,
            TxPower: TxPower,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                alert($.i18n.prop("common.dfsNotAvailable"));
                return;
            }  
            else if (obj.SetGlobalWifiResult == "SUCCESS") {
                
                $("#confirmACNo").modal('hide');
                alert($.i18n.prop("success.message"));        
                location.reload();
            } else {
                alert(obj.SetGlobalWifiResult);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            //clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetGlobalWifiConfigAdvanceDFSCancel() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var wifi_status, Select_Isolation, Select_ShowSecurity, ApMode, Mode, Channel, Bandwidth;

    wifi_status = $("#wifi_status").val();
    Select_Isolation = $("#Isolation").val();
    //Select_Isolation = 1 ; // OH6-2062
    // if ($("#Select_Isolation").prop('checked')) {
    //   Select_Isolation = 1;
    // } else {
    //   Select_Isolation = 0;
    // }

    Select_ShowSecurity = $("#ShowSecurity").val();

    ApMode = $("#ApMode").val();
    //ApMode = 0 ;  // OH6-2062
    // if ($("#Select_Multi").prop('checked')) {
    //   ApMode = 1;
    // } else {
    //   ApMode = 0;
    // }

    //ApMode = $("#ApMode").val();
    Mode = 'g';
    Channel = 0;
    Bandwidth = 0;

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetGlobalWifiConfig",
            Status: wifi_status,
            ApMode: ApMode,
            Mode: Mode,
            Channel: Channel,
            Bandwidth: Bandwidth,
            Isolation: Select_Isolation,
            ShowSecurity: Select_ShowSecurity,
            // SetGlobalWifiResult: "SUCCESS",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                alert($.i18n.prop("common.dfsNotAvailable"));
                return;
            }  
            else if (obj.SetGlobalWifiResult == "SUCCESS") {
                
                $("#confirmACNo").modal('hide');
                alert($.i18n.prop("success.message"));        
                location.reload();
            } else {
                alert(obj.SetGlobalWifiResult);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            //clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function ACCountdown() {
    //$("#door").val('outdoor');
    var timeleft = 30;
    acTimer = setInterval(function () {
        //document.getElementById("remain_time_countdown").innerHTML = timeleft + "sec";
        timeleft -= 1;
        if (timeleft <= 0) {
            clearInterval(acTimer);
            //document.getElementById("countdown").innerHTML = "Finished"
            $("#door").val('outdoor');
            $.LoadingOverlay("show");
            SetGlobalAdvanceWifiConfig();
            $("#confirmACYes").modal('hide');
            //DFSCountdown();
            //$("#confirmACNo").modal('show');
        }
    }, 1000);
}

function ACCountdownAtBasic() {
    //$("#door").val('outdoor');
    var timeleft = 30;
    acTimer = setInterval(function () {
        //document.getElementById("remain_time_countdown").innerHTML = timeleft + "sec";
        timeleft -= 1;
        if (timeleft <= 0) { 
            clearInterval(acTimer);
            //document.getElementById("countdown").innerHTML = "Finished"
            $("#door").val('outdoor');
            $.LoadingOverlay("show");
            SetBasicWifiAPConfigAndDFS();
            $("#confirmACYes").modal('hide');
            //DFSCountdown();
            //$("#confirmACNo").modal('show');
        }
    }, 1000);
}

function DFSCountdown() {
    var sendTime = (new Date()).getTime();
        // Something you want delayed.
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetWifiDFSState",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var responseTime = (new Date()).getTime();
            var executeTimeMs = responseTime - sendTime;                
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                return;
            }
            if (obj.result == "Token_mismatch") {
                return;
            }
            if (obj.commit == "Socket Send Error") {
                return;
            }
            if (obj.result == "QTApp_Login") {
                return;
            }
            if (obj.Result == "SUCCESS") {
                var DFS_state = obj.Value;
                if(DFS_state != "DFS")
                {
                    alert($.i18n.prop("success.message"));              
                    location.reload();
                }
                else
                {
                    $(".dfs_icon").show();
                    $("#confirmACNo").modal('show');
                    $("#remain_time_countdown").html("");
                    clearInterval(acTimer);
                    $("#door").val('outdoor');
                    var DFStimeleft = (57 - millisToMinutesAndSeconds(executeTimeMs));
                    downloadTimer = setInterval(function () {
                        document.getElementById("remain_time_countdown").innerHTML = DFStimeleft + $.i18n.prop("wifiadvance.sec");                           
                        if (DFStimeleft <= 0) {
                            clearInterval(downloadTimer);
                            $("#confirmACNo").modal("hide");    
                            dfsCheckToServer = self.setInterval("GetWifiDFSState()", 1000); // 1 seconds check again                                    
                        }
                        DFStimeleft -= 1;
                    }, 1000);
                    
                }
            } 
        }
    });    
    
}

function DFSCountdownIndoor() {
    clearInterval(acTimer);
    //$("#door").val('indoor');
    //SetGlobalAdvanceWifiConfig();
    var DFSIndoortimeleft = 60;
    downloadTimer = setInterval(function () {
        document.getElementById("remain_time_countdown").innerHTML = DFSIndoortimeleft + $.i18n.prop("wifiadvance.sec");
        DFSIndoortimeleft -= 1;
        if (DFSIndoortimeleft <= 0) {
            clearInterval(downloadTimer);
            $("#confirmACNo").modal("hide");
            //location.reload();
            //document.getElementById("countdown").innerHTML = "Finished"

        }
    }, 1000);
    dfsCheckToServer = self.setInterval("GetWifiDFSState()", 1000); // 1 seconds check again
}

function cancelDFSBasic() {
    clearInterval(downloadTimer);    
    clearInterval(dfsCheckToServer);  
    //SetGlobalWifiConfigBasicDFSCancel();
    SetBasicWifiAPConfigCancelDFSAtBasic(false);
}

function cancelDFS() {
    clearInterval(downloadTimer);
    clearInterval(dfsCheckToServer);
    // location.reload();
    // SetGlobalWifiConfigAdvanceDFSCancel();
    SetBasicWifiAPConfigCancelDFSAtAdvance(false);
}

function GetBasicWifiAPConfig() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetBasicWifiAPConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Wifi_Basic_Result == "SUCCESS") {

                var SSID_A_Name = obj.SSID_A_Name;
                var SSID_A_Mode = obj.SSID_A_Mode;
                var SSID_A_Security = obj.SSID_A_Security;
                var SSID_A_Password = obj.SSID_A_Password;
                var SSID_A_Stealth = obj.SSID_A_Stealth;
                var SSID_A_Privacy = obj.SSID_A_Privacy;
                var SSID_A_Max_Client = obj.SSID_A_Max_Client;
                var SSID_B_Name = obj.SSID_B_Name;
                var SSID_B_Mode = obj.SSID_B_Mode;
                var SSID_B_Status = obj.SSID_B_Status;
                var SSID_B_Security = obj.SSID_B_Security;
                var SSID_B_Password = obj.SSID_B_Password;
                var SSID_B_Stealth = obj.SSID_B_Stealth;
                var SSID_B_Privacy = obj.SSID_B_Privacy;
                var SSID_B_Max_Client = obj.SSID_B_Max_Client;
                var SSID_B_AccessWeb = obj.SSID_B_AccessWeb;
                var SSID_A_PMF = obj.SSID_A_PMF;
                var SSID_B_PMF = obj.SSID_B_PMF;

                $("#SSID_A_Name").val(SSID_A_Name);
                $("#SSID_A_Password").val(SSID_A_Password);

                $("#SSID_B_Status").val(SSID_B_Status);
                $("#SSID_B_Name").val(SSID_B_Name);
                $("#SSID_B_Password").val(SSID_B_Password);

                switch (SSID_A_Mode) {
                    case "a": // 5g
                        $("#Select_ModeA option[value='a']").prop('selected', true);
                        break;
                    default: // 2.4g
                        $("#Select_ModeA option[value='g']").prop('selected', true);
                        break;
                }

                switch (SSID_A_Max_Client) {
                    case "1":
                        $("#SSID_A_Max_Client option[value=1]").prop('selected', true);
                        break;
                    case "2":
                        $("#SSID_A_Max_Client option[value=2]").prop('selected', true);
                        break;
                    case "3":
                        $("#SSID_A_Max_Client option[value=3]").prop('selected', true);
                        break;
                    case "4":
                        $("#SSID_A_Max_Client option[value=4]").prop('selected', true);
                        break;
                    case "5":
                        $("#SSID_A_Max_Client option[value=5]").prop('selected', true);
                        break;
                    case "6":
                        $("#SSID_A_Max_Client option[value=6]").prop('selected', true);
                        break;
                    case "7":
                        $("#SSID_A_Max_Client option[value=7]").prop('selected', true);
                        break;
                    case "8":
                        $("#SSID_A_Max_Client option[value=8]").prop('selected', true);
                        break;
                    case "9":
                        $("#SSID_A_Max_Client option[value=9]").prop('selected', true);
                        break;
                    case "10":
                        $("#SSID_A_Max_Client option[value=10]").prop('selected', true);
                        break;
                    case "11":
                        $("#SSID_A_Max_Client option[value=11]").prop('selected', true);
                        break;
                    case "12":
                        $("#SSID_A_Max_Client option[value=12]").prop('selected', true);
                        break;
                    case "13":
                        $("#SSID_A_Max_Client option[value=13]").prop('selected', true);
                        break;
                    case "14":
                        $("#SSID_A_Max_Client option[value=14]").prop('selected', true);
                        break;
                    case "15":
                        $("#SSID_A_Max_Client option[value=15]").prop('selected', true);
                        break;
                    case "16":
                        $("#SSID_A_Max_Client option[value=16]").prop('selected', true);
                        break;
                    case "17":
                        $("#SSID_A_Max_Client option[value=17]").prop('selected', true);
                        break;
                    case "18":
                        $("#SSID_A_Max_Client option[value=18]").prop('selected', true);
                        break;
                    case "19":
                        $("#SSID_A_Max_Client option[value=19]").prop('selected', true);
                        break;
                    case "20":
                        $("#SSID_A_Max_Client option[value=20]").prop('selected', true);
                        break;
                    case "21":
                        $("#SSID_A_Max_Client option[value=21]").prop('selected', true);
                        break;
                    case "22":
                        $("#SSID_A_Max_Client option[value=22]").prop('selected', true);
                        break;
                    case "23":
                        $("#SSID_A_Max_Client option[value=23]").prop('selected', true);
                        break;
                    case "24":
                        $("#SSID_A_Max_Client option[value=24]").prop('selected', true);
                        break;
                    case "25":
                        $("#SSID_A_Max_Client option[value=25]").prop('selected', true);
                        break;
                    case "26":
                        $("#SSID_A_Max_Client option[value=26]").prop('selected', true);
                        break;
                    case "27":
                        $("#SSID_A_Max_Client option[value=27]").prop('selected', true);
                        break;
                    case "28":
                        $("#SSID_A_Max_Client option[value=28]").prop('selected', true);
                        break;
                    case "29":
                        $("#SSID_A_Max_Client option[value=29]").prop('selected', true);
                        break;
                    case "30":
                        $("#SSID_A_Max_Client option[value=30]").prop('selected', true);
                        break;
                    case "31":
                        $("#SSID_A_Max_Client option[value=31]").prop('selected', true);
                        break;
                    case "32":
                        $("#SSID_A_Max_Client option[value=32]").prop('selected', true);
                        break;
                }

                switch (SSID_A_Security) {
                    case "0":
                        $("#SSID_A_Security option[value=0]").prop('selected', true);
                        //$('#Select_SSID_A_PMF').bootstrapToggle('off');
                        $("#Select_SSID_A_PMF option[value=0]").prop('selected', true);
                        $("#Select_SSID_A_PMF").prop("disabled", true);
                        $("#SSID_A_Password").val('');
                        break;
                    case "1":
                        $("#SSID_A_Security option[value=1]").prop('selected', true);
                        if (SSID_A_PMF == "2") {
                            //$('#Select_SSID_A_PMF').bootstrapToggle('on');
                            $("#Select_SSID_A_PMF option[value=2]").prop('selected', true);
                        } else if (SSID_A_PMF == 0) {
                            //$('#Select_SSID_A_PMF').bootstrapToggle('off');
                            $("#Select_SSID_A_PMF option[value=0]").prop('selected', true);
                        }
                        break;
                    case "2":
                        $("#SSID_A_Security option[value=2]").prop('selected', true);
                        if (SSID_A_PMF == "2") {
                            //$('#Select_SSID_A_PMF').bootstrapToggle('on');
                            $("#Select_SSID_A_PMF option[value=2]").prop('selected', true);
                        } else if (SSID_A_PMF == 0) {
                            //$('#Select_SSID_A_PMF').bootstrapToggle('off');
                            $("#Select_SSID_A_PMF option[value=0]").prop('selected', true);
                        }
                        break;
                    case "3":
                        $("#SSID_A_Security option[value=3]").prop('selected', true);
                        //$('#Select_SSID_A_PMF').bootstrapToggle('on');
                        $("#Select_SSID_A_PMF option[value=2]").prop('selected', true);
                        $("#Select_SSID_A_PMF").prop("disabled", true);
                        break;
                    case "4":
                        $("#SSID_A_Security option[value=4]").prop('selected', true);
                        //$('#Select_SSID_A_PMF').bootstrapToggle('on');
                        $("#Select_SSID_A_PMF option[value=2]").prop('selected', true);
                        $("#Select_SSID_A_PMF").prop("disabled", true);
                        break;
                    case "5":
                        $("#SSID_A_Security option[value=5]").prop('selected', true);
                        //$('#Select_SSID_A_PMF').bootstrapToggle('on');
                        $("#Select_SSID_A_PMF option[value=2]").prop('selected', true);
                        $("#Select_SSID_A_PMF").prop("disabled", true);
                        $("#SSID_A_Password").val('');
                        break;
                }

                switch (SSID_B_Mode) {
                    case "a": // 5g
                        $("#Select_ModeB option[value='a']").prop('selected', true);
                        break;
                    default: // 2.4g
                        $("#Select_ModeB option[value='g']").prop('selected', true);
                        break;
                }

                switch (SSID_B_Max_Client) {
                    case "1":
                        $("#SSID_B_Max_Client option[value=1]").prop('selected', true);
                        break;
                    case "2":
                        $("#SSID_B_Max_Client option[value=2]").prop('selected', true);
                        break;
                    case "3":
                        $("#SSID_B_Max_Client option[value=3]").prop('selected', true);
                        break;
                    case "4":
                        $("#SSID_B_Max_Client option[value=4]").prop('selected', true);
                        break;
                    case "5":
                        $("#SSID_B_Max_Client option[value=5]").prop('selected', true);
                        break;
                    case "6":
                        $("#SSID_B_Max_Client option[value=6]").prop('selected', true);
                        break;
                    case "7":
                        $("#SSID_B_Max_Client option[value=7]").prop('selected', true);
                        break;
                    case "8":
                        $("#SSID_B_Max_Client option[value=8]").prop('selected', true);
                        break;
                    case "9":
                        $("#SSID_B_Max_Client option[value=9]").prop('selected', true);
                        break;
                    case "10":
                        $("#SSID_B_Max_Client option[value=10]").prop('selected', true);
                        break;
                    case "11":
                        $("#SSID_B_Max_Client option[value=11]").prop('selected', true);
                        break;
                    case "12":
                        $("#SSID_B_Max_Client option[value=12]").prop('selected', true);
                        break;
                    case "13":
                        $("#SSID_B_Max_Client option[value=13]").prop('selected', true);
                        break;
                    case "14":
                        $("#SSID_B_Max_Client option[value=14]").prop('selected', true);
                        break;
                    case "15":
                        $("#SSID_B_Max_Client option[value=15]").prop('selected', true);
                        break;
                    case "16":
                        $("#SSID_B_Max_Client option[value=16]").prop('selected', true);
                        break;
                    case "17":
                        $("#SSID_B_Max_Client option[value=17]").prop('selected', true);
                        break;
                    case "18":
                        $("#SSID_B_Max_Client option[value=18]").prop('selected', true);
                        break;
                    case "19":
                        $("#SSID_B_Max_Client option[value=19]").prop('selected', true);
                        break;
                    case "20":
                        $("#SSID_B_Max_Client option[value=20]").prop('selected', true);
                        break;
                    case "21":
                        $("#SSID_B_Max_Client option[value=21]").prop('selected', true);
                        break;
                    case "22":
                        $("#SSID_B_Max_Client option[value=22]").prop('selected', true);
                        break;
                    case "23":
                        $("#SSID_B_Max_Client option[value=23]").prop('selected', true);
                        break;
                    case "24":
                        $("#SSID_B_Max_Client option[value=24]").prop('selected', true);
                        break;
                    case "25":
                        $("#SSID_B_Max_Client option[value=25]").prop('selected', true);
                        break;
                    case "26":
                        $("#SSID_B_Max_Client option[value=26]").prop('selected', true);
                        break;
                    case "27":
                        $("#SSID_B_Max_Client option[value=27]").prop('selected', true);
                        break;
                    case "28":
                        $("#SSID_B_Max_Client option[value=28]").prop('selected', true);
                        break;
                    case "29":
                        $("#SSID_B_Max_Client option[value=29]").prop('selected', true);
                        break;
                    case "30":
                        $("#SSID_B_Max_Client option[value=30]").prop('selected', true);
                        break;
                    case "31":
                        $("#SSID_B_Max_Client option[value=31]").prop('selected', true);
                        break;
                    case "32":
                        $("#SSID_B_Max_Client option[value=32]").prop('selected', true);
                        break;
                }
                
                switch (SSID_B_Security) {
                    case "0":
                        $("#SSID_B_Security option[value=0]").prop('selected', true);
                        //$('#Select_SSID_B_PMF').bootstrapToggle('off');
                        $("#Select_SSID_B_PMF option[value=0]").prop('selected', true);
                        $("#Select_SSID_B_PMF").prop("disabled", true);
                        $("#SSID_B_Password").val('');
                        break;
                    case "1":
                        $("#SSID_B_Security option[value=1]").prop('selected', true);
                        if (SSID_B_PMF == "2") {
                            //$('#Select_SSID_B_PMF').bootstrapToggle('on');
                            $("#Select_SSID_B_PMF option[value=2]").prop('selected', true);
                        } else if (SSID_B_PMF == 0) {
                            //$('#Select_SSID_B_PMF').bootstrapToggle('off');
                            $("#Select_SSID_B_PMF option[value=0]").prop('selected', true);
                        }
                        break;
                    case "2":
                        $("#SSID_B_Security option[value=2]").prop('selected', true);
                        if (SSID_B_PMF == "2") {
                            //$('#Select_SSID_B_PMF').bootstrapToggle('on');
                            $("#Select_SSID_B_PMF option[value=2]").prop('selected', true);
                        } else if (SSID_B_PMF == 0) {
                            //$('#Select_SSID_B_PMF').bootstrapToggle('off');
                            $("#Select_SSID_B_PMF option[value=0]").prop('selected', true);
                        }
                        break;
                    case "3":
                        $("#SSID_B_Security option[value=3]").prop('selected', true);
                        //$('#Select_SSID_B_PMF').bootstrapToggle('on');
                        $("#Select_SSID_B_PMF option[value=2]").prop('selected', true);
                        $("#Select_SSID_B_PMF").prop("disabled", true);
                        break;
                    case "4":
                        $("#SSID_B_Security option[value=4]").prop('selected', true);
                        //$('#Select_SSID_B_PMF').bootstrapToggle('on');
                        $("#Select_SSID_B_PMF option[value=2]").prop('selected', true);
                        $("#Select_SSID_B_PMF").prop("disabled", true);
                        break;
                    case "5":
                        $("#SSID_B_Security option[value=5]").prop('selected', true);
                        //$('#Select_SSID_B_PMF').bootstrapToggle('on');
                        $("#Select_SSID_B_PMF option[value=2]").prop('selected', true);
                        $("#Select_SSID_B_PMF").prop("disabled", true);
                        $("#SSID_B_Password").val('');
                        break;
                }


                // if (SSID_A_Stealth == 1) {
                //   $('#Select_SSID_A_Stealth').bootstrapToggle('on');
                // } else if (SSID_A_Stealth == 0) {
                //   $('#Select_SSID_A_Stealth').bootstrapToggle('off');
                // }
                switch (String(SSID_A_Stealth)) {
                    case "1":
                        $("#Select_SSID_A_Stealth option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_SSID_A_Stealth option[value=0]").prop('selected', true);
                        break;
                }


                // if (SSID_B_Stealth == 1) {
                //   $('#Select_SSID_B_Stealth').bootstrapToggle('on');
                // } else if (SSID_B_Stealth == 0) {
                //   $('#Select_SSID_B_Stealth').bootstrapToggle('off');
                // }
                switch (String(SSID_B_Stealth)) {
                    case "1":
                        $("#Select_SSID_B_Stealth option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_SSID_B_Stealth option[value=0]").prop('selected', true);
                        break;
                }


                switch (String(SSID_A_Privacy)) {
                    case "1":
                        $("#Select_SSID_A_Privacy option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_SSID_A_Privacy option[value=0]").prop('selected', true);
                        break;
                }

                switch (String(SSID_B_Privacy)) {
                    case "1":
                        $("#Select_SSID_B_Privacy option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_SSID_B_Privacy option[value=0]").prop('selected', true);
                        break;
                }

                switch (String(SSID_B_AccessWeb)) {
                    case "1":
                        $("#SSID_B_AccessWeb option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#SSID_B_AccessWeb option[value=0]").prop('selected', true);
                        break;
                }

                // if (SSID_A_Privacy == 1) {
                //   $('#Select_SSID_A_Privacy').bootstrapToggle('on');
                // } else if (SSID_A_Privacy == 0) {
                //   $('#Select_SSID_A_Privacy').bootstrapToggle('off');
                // }

                //SSID_B_Privacy = $("#Select_SSID_B_Privacy").val();
                // if (SSID_B_Privacy == 1) {
                //   $('#Select_SSID_B_Privacy').bootstrapToggle('on');
                // } else if (SSID_B_Privacy == 0) {
                //   $('#Select_SSID_B_Privacy').bootstrapToggle('off');
                // }

                //SSID_B_AccessWeb = $("#SSID_B_AccessWeb").val();
                // if (SSID_B_AccessWeb == "1") {
                //   $('#SSID_B_AccessWeb').bootstrapToggle('on');
                // } else if (SSID_B_AccessWeb == 0) {
                //   $('#SSID_B_AccessWeb').bootstrapToggle('off');
                // }          
                //KittyLock
                findKittyKey('Wifi', 'Select_wifi_status');
                findKittyKey('MultiSsid', 'Select_Multi');
                findKittyKey('ShowSsidAndPasswordOnTouchScreen', 'Select_ShowSecurity');
                findKittyKey('MultiSsidApIsolation', 'Select_Isolation');
                findKittyKey('MaxNoOfConnectedClients', 'SSID_A_Max_Client');
                findKittyKey('SsidA_Ssid', 'SSID_A_Name');
                findKittyKey('SsidA_Password', 'SSID_A_Password');
                findKittyKey('SsidA_Security', 'SSID_A_Security');
                findKittyKey('SsidA_PrivacySeparator', 'Select_SSID_A_Privacy');
                findKittyKey('SsidA_SsidStealth', 'Select_SSID_A_Stealth');
                findKittyKey('SsidA_WifiPmf', 'Select_SSID_A_PMF');
                findKittyKey('SsidB_Ssid', 'SSID_B_Name');
                findKittyKey('SsidB_Password', 'SSID_B_Password');
                findKittyKey('SsidB_Security', 'SSID_B_Security');
                findKittyKey('SsidB_PrivacySeparator', 'Select_SSID_B_Privacy');
                findKittyKey('SsidB_SsidStealth', 'Select_SSID_B_Stealth');
                findKittyKey('SsidB_WifiPmf', 'Select_SSID_B_PMF');
                // no service hide 5g option
                // GetRoamingStatusAtBasic();

            } else {
                alert(obj.Wifi_Basic_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function GetBasicWifiAPConfigAtAdvance() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetBasicWifiAPConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Wifi_Basic_Result == "SUCCESS") {

                var SSID_A_Name = obj.SSID_A_Name;
                var SSID_A_Mode = obj.SSID_A_Mode;
                var SSID_A_Security = obj.SSID_A_Security;
                var SSID_A_Password = obj.SSID_A_Password;
                var SSID_A_Stealth = obj.SSID_A_Stealth;
                var SSID_A_Privacy = obj.SSID_A_Privacy;
                var SSID_A_Max_Client = obj.SSID_A_Max_Client;
                var SSID_B_Name = obj.SSID_B_Name;
                var SSID_B_Mode = obj.SSID_B_Mode;
                var SSID_B_Status = obj.SSID_B_Status;
                var SSID_B_Security = obj.SSID_B_Security;
                var SSID_B_Password = obj.SSID_B_Password;
                var SSID_B_Stealth = obj.SSID_B_Stealth;
                var SSID_B_Privacy = obj.SSID_B_Privacy;
                var SSID_B_Max_Client = obj.SSID_B_Max_Client;
                var SSID_B_AccessWeb = obj.SSID_B_AccessWeb;
                var SSID_A_PMF = obj.SSID_A_PMF;
                var SSID_B_PMF = obj.SSID_B_PMF;

                $("#SSID_A_Mode").val(SSID_A_Mode);
                $("#SSID_B_Mode").val(SSID_B_Mode);

            } else {
                alert(obj.Wifi_Basic_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function WifiBasicConfirm() {
    clearInterval(dfsCheckToServer);
    var Error_Msg = "";
    var wifi_status = "";
    var SSID_A_Mode = $("#Select_ModeA").val();
    var SSID_A_Name = $("#SSID_A_Name").val();
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_A_Password = $("#SSID_A_Password").val();
    var SSID_A_Stealth;
    var SSID_A_Privacy;
    var SSID_A_Max_Client = $("#SSID_A_Max_Client").val();
    var SSID_B_Status;
    var SSID_B_Mode = $("#Select_ModeB").val();
    var SSID_B_Name = $("#SSID_B_Name").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var SSID_B_Password = $("#SSID_B_Password").val();
    var SSID_B_Stealth;
    var SSID_B_Privacy;
    var SSID_B_Max_Client = $("#SSID_B_Max_Client").val();
    var SSID_B_AccessWeb;
    var SSID_A_PMF;
    var SSID_B_PMF;
    if (SSID_A_Security == '0' || SSID_A_Security == '5' || SSID_B_Security == '0' || SSID_B_Security == '5') {
        $("#confirmOpen").modal('show');
        return;
    }
    else {
        $("#applyWifiBasicDisconnectModal").modal('show');
        return;
    }

}

function WifiBasicOpenConfirm() {
    $("#confirmOpen").modal('hide');
    $("#applyWifiBasicDisconnectModal").modal('show');
}

function SetBasicWifiAPConfig() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    $("#applyWifiBasicDisconnectModal").modal('hide');

    var flag = SetBasicWifiAPConfig_check();
    if (flag) {
        //1.Check SSID A Wi-Fi Mode or SSID B Wi-Fi Mode is 5 GHz
        //* Check SSID B only when Multi SSID is enabled 
        var Select_wifi_status = $("#Select_wifi_status").val();
        var OLD_Select_wifi_status = $("#OLD_Select_wifi_status").val();
        var Select_Multi = $("#Select_Multi").val();
        var Select_ModeA = $("#Select_ModeA").val();
        var Select_ModeB = $("#Select_ModeB").val();
        var dfs = false;

        if(Select_wifi_status=="1" && Select_ModeA=="a") {
            dfs = true;
        } else if(Select_wifi_status=="1" && Select_Multi=="1"  && Select_ModeB=="a") {
            dfs = true;
        } else {
            dfs = false;
        }
        if(dfs)
        {         
            SetBasicWifiAPConfigAtBasic(dfs);
            //2.Check in service and country code is japan
            // $.ajax({
            //     type: "POST",
            //     url: "../../cgi-bin/qcmap_web_cgi",
            //     data: {
            //         Page: "GetHomeDeviceInfo",
            //         mask: "0",
            //         token: session_token
            //     },
            //     dataType: "text",
            //     success: function (msgs) {
            //         if (msgs.length > 0) {
            //             var obj = jQuery.parseJSON(msgs);
            //             var SignalStatus = obj.SignalStatus;
            //             var MCC = obj.MCC;

            //             if (obj.result == "AUTH_FAIL") {
            //                 clearSession();
            //                 alert($.i18n.prop("error.AUTH_FAIL"));
            //                 return;
            //             }
            //             if (obj.result == "Token_mismatch") {
            //                 clearSession();
            //                 alert($.i18n.prop("error.Token_mismatch"));
            //                 return;
            //             }
            //             if (obj.commit == "Socket Send Error") {
            //                 clearSession();
            //                 alert($.i18n.prop("error.SocketSendError"));
            //                 return;
            //             }
            //             if (obj.result == "QTApp_Login") {
            //                 clearSession();
            //                 alert($.i18n.prop("common.Routerdeviceinuse"));
            //                 return;
            //             }        
                        
            //             SetBasicWifiAPConfigAtBasic(dfs);
            //             // if (MCC == "" ) {
            //             //     //no service
            //             //     alert($.i18n.prop("error.noservice")); 
            //             //     // SetBasicWifiAPConfigOnly();    
            //             //     SetBasicWifiAPConfigAtBasic(false);
            //             // }
            //             // else if (SignalStatus != "1" && SignalStatus != "2") {
            //             //     //5g is not avaliable no service
            //             //     alert($.i18n.prop("error.noservice")); 
            //             //     // SetBasicWifiAPConfigOnly();      
            //             //     SetBasicWifiAPConfigAtBasic(false);                             
            //             // }else {           
            //             //     // SetBasicWifiAPConfigAndDFS();
            //             //     SetBasicWifiAPConfigAtBasic(dfs);
                                          
            //             // }     
            //         }
            //     }
            // });    
        }
        else
        { 
            // Applying Disconnect process and 01 
            // SetBasicWifiAPConfigOnly();
            SetBasicWifiAPConfigAtBasic(false);
        }
    }
}

function SetBasicWifiAPConfigOnly() { //no dfs
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var Error_Msg = "";
    var wifi_status = "";
    
    var SSID_A_Mode = $("#Select_ModeA").val();
    var SSID_A_Name = $("#SSID_A_Name").val();
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_A_Password = $("#SSID_A_Password").val();
    var SSID_A_Stealth;
    var SSID_A_Privacy;
    var SSID_A_Max_Client = $("#SSID_A_Max_Client").val();
    var SSID_B_Status;
    var SSID_B_Mode = $("#Select_ModeB").val();
    var SSID_B_Name = $("#SSID_B_Name").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var SSID_B_Password = $("#SSID_B_Password").val();
    var SSID_B_Stealth;
    var SSID_B_Privacy;
    var SSID_B_Max_Client = $("#SSID_B_Max_Client").val() ;
    var SSID_B_AccessWeb;
    var SSID_A_PMF;
    var SSID_B_PMF;

    // if (SSID_A_Security == '0' || SSID_A_Security == '5' || SSID_B_Security == '0' || SSID_B_Security == '5') {
    //     $("#confirmOpen").modal('show');
    //     return;
    // }

    SSID_B_Status = $("#SSID_B_Status").val();
    // if ($("#SSID_B_Status").prop('checked')) {
    //   SSID_B_Status = 1;
    // } else {
    //   SSID_B_Status = 0;
    // }

    SSID_B_AccessWeb = $("#SSID_B_AccessWeb").val();
    // if ($("#SSID_B_AccessWeb").prop('checked')) {
    //   SSID_B_AccessWeb = 1;
    // } else {
    //   SSID_B_AccessWeb = 0;
    // }

    SSID_A_Stealth = $("#Select_SSID_A_Stealth").val();
    // if ($("#Select_SSID_A_Stealth").prop('checked')) {
    //   SSID_A_Stealth = 1;
    // } else {
    //   SSID_A_Stealth = 0;
    // }

    SSID_A_Privacy = $("#Select_SSID_A_Privacy").val();
    // if ($("#Select_SSID_A_Privacy").prop('checked')) {
    //   SSID_A_Privacy = 1;
    // } else {
    //   SSID_A_Privacy = 0;
    // }

    SSID_B_Stealth = $("#Select_SSID_B_Stealth").val();
    // if ($("#Select_SSID_B_Stealth").prop('checked')) {
    //   SSID_B_Stealth = 1;
    // } else {
    //   SSID_B_Stealth = 0;
    // }

    SSID_B_Privacy = $("#Select_SSID_B_Privacy").val();
    // if ($("#Select_SSID_B_Privacy").prop('checked')) {
    //   SSID_B_Privacy = 1;
    // } else {
    //   SSID_B_Privacy = 0;
    // }

    SSID_A_PMF = $("#Select_SSID_A_PMF").val();
    // if ($("#Select_SSID_A_PMF").prop('checked')) {
    //   SSID_A_PMF = 2;
    // } else {
    //   SSID_A_PMF = 0;
    // }  

    SSID_B_PMF = $("#Select_SSID_B_PMF").val();
    // if ($("#Select_SSID_B_PMF").prop('checked')) {
    //   SSID_B_PMF = 2;
    // } else {
    //   SSID_B_PMF = 0;
    // }  

    var form = {
        Page: "SetBasicWifiAPConfig",
        SSID_A_Name: SSID_A_Name,
        SSID_A_Mode: SSID_A_Mode,
        SSID_A_Security: SSID_A_Security,
        SSID_A_Password: SSID_A_Password,
        SSID_A_Stealth: SSID_A_Stealth,
        SSID_A_Privacy: SSID_A_Privacy,
        SSID_A_Max_Client: SSID_A_Max_Client,
        SSID_A_PMF: SSID_A_PMF,       
        SSID_B_Name: SSID_B_Name,
        SSID_B_Mode: SSID_B_Mode,
        SSID_B_Status: SSID_B_Status,
        SSID_B_Security: SSID_B_Security,
        SSID_B_Password: SSID_B_Password,
        SSID_B_Stealth: SSID_B_Stealth,
        SSID_B_Privacy: SSID_B_Privacy,
        SSID_B_Max_Client: SSID_B_Max_Client,
        SSID_B_PMF: SSID_B_PMF,
        SSID_B_AccessWeb: SSID_B_AccessWeb,
        token: session_token
    };

    var flag = SetBasicWifiAPConfig_check();
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetBasicWifiAPConfig",
                SSID_A_Name: SSID_A_Name,
                SSID_A_Mode: SSID_A_Mode,
                SSID_A_Security: SSID_A_Security,
                SSID_A_Password: SSID_A_Password,
                SSID_A_Stealth: SSID_A_Stealth,
                SSID_A_Privacy: SSID_A_Privacy,
                SSID_A_Max_Client: SSID_A_Max_Client,
                SSID_A_PMF: SSID_A_PMF,             
                SSID_B_Name: SSID_B_Name,
                SSID_B_Mode: SSID_B_Mode,
                SSID_B_Status: SSID_B_Status,
                SSID_B_Security: SSID_B_Security,
                SSID_B_Password: SSID_B_Password,
                SSID_B_Stealth: SSID_B_Stealth,
                SSID_B_Privacy: SSID_B_Privacy,
                SSID_B_Max_Client: SSID_B_Max_Client, 
                SSID_B_PMF: SSID_B_PMF,
                SSID_B_AccessWeb: SSID_B_AccessWeb,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Wifi_Basic_Result == "SUCCESS") {
                    SetGlobalWifiConfig();
                } else {
                    alert(obj.Wifi_Basic_Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetBasicWifiAPConfigAndDFS() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var Error_Msg = "";
    var wifi_status = "";
    var SSID_A_Mode = $("#Select_ModeA").val();
    var SSID_A_Name = $("#SSID_A_Name").val();
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_A_Password = $("#SSID_A_Password").val();
    var SSID_A_Stealth;
    var SSID_A_Privacy;
    var SSID_A_Max_Client = $("#SSID_A_Max_Client").val();
    var SSID_B_Status;
    var SSID_B_Mode = $("#Select_ModeB").val();
    var SSID_B_Name = $("#SSID_B_Name").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var SSID_B_Password = $("#SSID_B_Password").val();
    var SSID_B_Stealth;
    var SSID_B_Privacy;
    var SSID_B_Max_Client = $("#SSID_B_Max_Client").val();
    var SSID_B_AccessWeb;
    var SSID_A_PMF;
    var SSID_B_PMF;

    // if (SSID_A_Security == '0' || SSID_A_Security == '5' || SSID_B_Security == '0' || SSID_B_Security == '5') {
    //     $("#confirmOpen").modal('show');
    //     return;
    // }

    SSID_B_Status = $("#SSID_B_Status").val();
    // if ($("#SSID_B_Status").prop('checked')) {
    //   SSID_B_Status = 1;
    // } else {
    //   SSID_B_Status = 0;
    // }

    SSID_B_AccessWeb = $("#SSID_B_AccessWeb").val();
    // if ($("#SSID_B_AccessWeb").prop('checked')) {
    //   SSID_B_AccessWeb = 1;
    // } else {
    //   SSID_B_AccessWeb = 0;
    // }

    SSID_A_Stealth = $("#Select_SSID_A_Stealth").val();
    // if ($("#Select_SSID_A_Stealth").prop('checked')) {
    //   SSID_A_Stealth = 1;
    // } else {
    //   SSID_A_Stealth = 0;
    // }

    SSID_A_Privacy = $("#Select_SSID_A_Privacy").val();
    // if ($("#Select_SSID_A_Privacy").prop('checked')) {
    //   SSID_A_Privacy = 1;
    // } else {
    //   SSID_A_Privacy = 0;
    // }

    SSID_B_Stealth = $("#Select_SSID_B_Stealth").val();
    // if ($("#Select_SSID_B_Stealth").prop('checked')) {
    //   SSID_B_Stealth = 1;
    // } else {
    //   SSID_B_Stealth = 0;
    // }

    SSID_B_Privacy = $("#Select_SSID_B_Privacy").val();
    // if ($("#Select_SSID_B_Privacy").prop('checked')) {
    //   SSID_B_Privacy = 1;
    // } else {
    //   SSID_B_Privacy = 0;
    // }

    SSID_A_PMF = $("#Select_SSID_A_PMF").val();
    // if ($("#Select_SSID_A_PMF").prop('checked')) {
    //   SSID_A_PMF = 2;
    // } else {
    //   SSID_A_PMF = 0;
    // }  

    SSID_B_PMF = $("#Select_SSID_B_PMF").val();
    // if ($("#Select_SSID_B_PMF").prop('checked')) {
    //   SSID_B_PMF = 2;
    // } else {
    //   SSID_B_PMF = 0;
    // }  

    var form = {
        Page: "SetBasicWifiAPConfig",
        SSID_A_Name: SSID_A_Name,
        SSID_A_Mode: SSID_A_Mode,
        SSID_A_Security: SSID_A_Security,
        SSID_A_Password: SSID_A_Password,
        SSID_A_Stealth: SSID_A_Stealth,
        SSID_A_Privacy: SSID_A_Privacy,
        SSID_A_Max_Client: SSID_A_Max_Client,
        SSID_A_PMF: SSID_A_PMF,
        SSID_B_Name: SSID_B_Name,
        SSID_B_Mode: SSID_B_Mode,
        SSID_B_Status: SSID_B_Status,
        SSID_B_Security: SSID_B_Security,
        SSID_B_Password: SSID_B_Password,
        SSID_B_Stealth: SSID_B_Stealth,
        SSID_B_Privacy: SSID_B_Privacy,
        SSID_B_Max_Client: SSID_B_Max_Client,
        SSID_B_PMF: SSID_B_PMF,
        SSID_B_AccessWeb: SSID_B_AccessWeb,
        token: session_token
    };

    var flag = SetBasicWifiAPConfig_check();
    if (flag) {
        //$.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetBasicWifiAPConfig",
                SSID_A_Name: SSID_A_Name,
                SSID_A_Mode: SSID_A_Mode,
                SSID_A_Security: SSID_A_Security,
                SSID_A_Password: SSID_A_Password,
                SSID_A_Stealth: SSID_A_Stealth,
                SSID_A_Privacy: SSID_A_Privacy,
                SSID_A_Max_Client: SSID_A_Max_Client,
                SSID_A_PMF: SSID_A_PMF,     
                SSID_B_Name: SSID_B_Name,
                SSID_B_Mode: SSID_B_Mode,
                SSID_B_Status: SSID_B_Status,
                SSID_B_Security: SSID_B_Security,
                SSID_B_Password: SSID_B_Password,
                SSID_B_Stealth: SSID_B_Stealth,
                SSID_B_Privacy: SSID_B_Privacy,
                SSID_B_Max_Client: SSID_B_Max_Client, 
                SSID_B_PMF: SSID_B_PMF,
                SSID_B_AccessWeb: SSID_B_AccessWeb,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Wifi_Basic_Result == "SUCCESS") {

                    //alert('Success, now setting SetGlobalWifiConfig... ');
                    //location.reload();
                    //============!!!!!!
                    SetGlobalWifiConfigAdvanceAtBasic()
                    //SetGlobalWifiConfig();
                } else {
                    alert(obj.Wifi_Basic_Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetGlobalWifiConfigAdvanceAtBasic() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var wifi_status, Select_Isolation, Select_ShowSecurity, ApMode, Mode, Channel, Bandwidth, Select_channel_5;

    //$.LoadingOverlay("show");
    wifi_status = $("#Select_wifi_status").val();
    Select_Isolation = $("#Select_Isolation").val();
    if ($("#Select_ShowSecurity").prop('checked')) {
        Select_ShowSecurity = 1;
    } else {
        Select_ShowSecurity = 0;
    }
    ApMode = $("#Select_Multi").val();
    Mode = $("#Mode").val();
    Bandwidth = $("#Bandwidth").val();
    // Channel = $("#Channel").val();
    Select_channel_5 = $("#Channel").val();
    door = $("#door").val();
    if (door == "indoor") {
        switch(Select_channel_5)
        {
            case "0a":
                Channel = "53a";
            break;
            default:
                Channel = "53";
            break;
        }              
    } else {
        switch(Select_channel_5)
        {
            case "0a":
                Channel = "56a";
            break;
            default:
                Channel = "56";
            break;
        }        
    }
    // if (Mode == "g") {
    //     Channel = $("#Select_channel_2").val();
    //     Bandwidth = $("#Select_Bandwidth_2").val();
    // } else {
    //     //Channel = "a";
    //     Bandwidth = $("#Select_Bandwidth_5").val();
    //     if (door == "indoor") {
    //         Channel = "52";
    //     } else {
    //         Channel = "56";
    //     }
    // }

    var form = {
        Page: "SetGlobalWifiConfig",
        Status: wifi_status,
        // ApMode: ApMode,
        // Mode: Mode,
        Channel: Channel,
        Bandwidth: Bandwidth,
        Isolation: Select_Isolation,
        ShowSecurity: Select_ShowSecurity,
        token: session_token
    };
    //$.LoadingOverlay("show");
    var flag = true;
    if (flag) {

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetGlobalWifiConfig",
                Status: wifi_status,
                ApMode: ApMode,
                Mode: Mode,
                Channel: Channel,
                Bandwidth: Bandwidth,
                Isolation: Select_Isolation,
                ShowSecurity: Select_ShowSecurity,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                    alert($.i18n.prop("common.dfsNotAvailable"));
                    return;
                }  
                else if (obj.SetGlobalWifiResult == "SUCCESS") {
                    // alert($.i18n.prop("success.message"));
                    // if (Channel != '56') {
                    //     location.reload();
                    // }


                    if (Mode == "g") {

                        alert($.i18n.prop("success.message"));
                        location.reload();
                    } else {
                        $("#confirmACYes").modal('hide');
                        $.LoadingOverlay("hide");
                        // $("#confirmACNo").modal('show');
                        DFSCountdown();
                        // if (door == "indoor") {
                        //     alert($.i18n.prop("success.message"));
                        //     location.reload();
                        // }
                        // else {
                        //     $.LoadingOverlay("hide");
                        //     $("#confirmACNo").modal('show');
                        //     DFSCountdown();
                            
                        // }
                    }

                } else {
                    alert(obj.SetGlobalWifiResult);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetBasicWifiAPConfigOpen() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var Error_Msg = "";
    var wifi_status = "";
    var SSID_A_Name = $("#SSID_A_Name").val();
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_A_Password = $("#SSID_A_Password").val();
    var SSID_A_Stealth;
    var SSID_A_Privacy;
    var SSID_A_Max_Client = $("#SSID_A_Max_Client").val();
    var SSID_B_Status;
    var SSID_B_Name = $("#SSID_B_Name").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var SSID_B_Password = $("#SSID_B_Password").val();
    var SSID_B_Stealth;
    var SSID_B_Privacy;
    var SSID_B_Max_Client = $("#SSID_B_Max_Client").val() ? $("#SSID_B_Max_Client").val() : $("#SSID_A_Max_Client").val();
    var SSID_B_AccessWeb;
    var SSID_A_PMF;
    var SSID_B_PMF;

    SSID_B_Status = $("#SSID_B_Status").val();
    // if ($("#SSID_B_Status").prop('checked')) {
    //   SSID_B_Status = 1;
    // } else {
    //   SSID_B_Status = 0;
    // }

    SSID_B_AccessWeb = $("#SSID_B_AccessWeb").val();
    // if ($("#SSID_B_AccessWeb").prop('checked')) {
    //   SSID_B_AccessWeb = 1;
    // } else {
    //   SSID_B_AccessWeb = 0;
    // }

    SSID_A_Stealth = $("#Select_SSID_A_Stealth").val();
    // if ($("#Select_SSID_A_Stealth").prop('checked')) {
    //   SSID_A_Stealth = 1;
    // } else {
    //   SSID_A_Stealth = 0;
    // }

    SSID_A_Privacy = $("#Select_SSID_A_Privacy").val();
    // if ($("#Select_SSID_A_Privacy").prop('checked')) {
    //   SSID_A_Privacy = 1;
    // } else {
    //   SSID_A_Privacy = 0;
    // }

    SSID_B_Stealth = $("#Select_SSID_B_Stealth").val();
    // if ($("#Select_SSID_B_Stealth").prop('checked')) {
    //   SSID_B_Stealth = 1;
    // } else {
    //   SSID_B_Stealth = 0;
    // }

    SSID_B_Privacy = $("#Select_SSID_B_Privacy").val();
    // if ($("#Select_SSID_B_Privacy").prop('checked')) {
    //   SSID_B_Privacy = 1;
    // } else {
    //   SSID_B_Privacy = 0;
    // }

    SSID_A_PMF = $("#Select_SSID_A_PMF").val();
    // if ($("#Select_SSID_A_PMF").prop('checked')) {
    //   SSID_A_PMF = 2;
    // } else {
    //   SSID_A_PMF = 0;
    // }  

    SSID_B_PMF = $("#Select_SSID_B_PMF").val();
    // if ($("#Select_SSID_B_PMF").prop('checked')) {
    //   SSID_B_PMF = 2;
    // } else {
    //   SSID_B_PMF = 0;
    // }  

    var form = {
        Page: "SetBasicWifiAPConfig",
        SSID_A_Name: SSID_A_Name,
        SSID_A_Security: SSID_A_Security,
        SSID_A_Password: SSID_A_Password,
        SSID_A_Stealth: SSID_A_Stealth,
        SSID_A_Privacy: SSID_A_Privacy,
        SSID_A_Max_Client: SSID_A_Max_Client,
        SSID_A_PMF: SSID_A_PMF,
        SSID_B_Status: SSID_B_Status,
        SSID_B_Name: SSID_B_Name,
        SSID_B_Security: SSID_B_Security,
        SSID_B_Password: SSID_B_Password,
        SSID_B_Stealth: SSID_B_Stealth,
        SSID_B_Privacy: SSID_B_Privacy,
        SSID_B_Max_Client: SSID_B_Max_Client,
        SSID_B_PMF: SSID_B_PMF,
        SSID_B_AccessWeb: SSID_B_AccessWeb,
        token: session_token
    };

    var flag = SetBasicWifiAPConfig_check();
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetBasicWifiAPConfig",
                SSID_A_Name: SSID_A_Name,
                SSID_A_Security: SSID_A_Security,
                SSID_A_Password: SSID_A_Password,
                SSID_A_Stealth: SSID_A_Stealth,
                SSID_A_Privacy: SSID_A_Privacy,
                SSID_A_Max_Client: SSID_A_Max_Client,
                SSID_A_PMF: SSID_A_PMF,
                SSID_B_Status: SSID_B_Status,
                SSID_B_Name: SSID_B_Name,
                SSID_B_Security: SSID_B_Security,
                SSID_B_Password: SSID_B_Password,
                SSID_B_Stealth: SSID_B_Stealth,
                SSID_B_Privacy: SSID_B_Privacy,
                SSID_B_Max_Client: SSID_B_Max_Client, 
                SSID_B_PMF: SSID_B_PMF,
                SSID_B_AccessWeb: SSID_B_AccessWeb,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Wifi_Basic_Result == "SUCCESS") {

                    //alert('Success, now setting SetGlobalWifiConfig... ');
                    //location.reload();
                    SetGlobalWifiConfig();
                } else {
                    alert(obj.Wifi_Basic_Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetBasicWifiAPConfig_check() {
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_B_Security = $("#SSID_B_Security").val();

    if ((SSID_A_Security == "0" || SSID_A_Security == "5") && (SSID_B_Security == "0" || SSID_B_Security == "5")) // Open,no check password
    {
        if (!checkNameStringType4("SSID_A_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else if (!checkNameStringType4("SSID_B_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else {
            return true;
        }

    } else if (SSID_A_Security == "0" || SSID_A_Security == "5") {
        if (!checkNameStringType4("SSID_A_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else if (!checkNameStringType4("SSID_B_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else if (!checkNameStringType9("SSID_B_Password", 8, 64, $.i18n.prop("common.Password"))) {
            return false;
        } else {
            return true;
        }
    } else if (SSID_B_Security == "0" || SSID_B_Security == "5") {
        if (!checkNameStringType4("SSID_A_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else if (!checkNameStringType9("SSID_A_Password", 8, 64, $.i18n.prop("common.Password"))) {
            return false;
        } else if (!checkNameStringType4("SSID_B_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else {
            return true;
        }
    } else {
        if (!checkNameStringType4("SSID_A_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else if (!checkNameStringType9("SSID_A_Password", 8, 64, $.i18n.prop("common.Password"))) {
            return false;
        } else if (!checkNameStringType4("SSID_B_Name", 1, 32, $.i18n.prop("wifi.basic.SSID"))) {
            return false;
        } else if (!checkNameStringType9("SSID_B_Password", 8, 64, $.i18n.prop("common.Password"))) {
            return false;
        } else {
            return true;
        }
    }
}

function GetConnectWifiDevice(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var card_A = card_B = card_USB = card_Ethernet = "";
    //var card = "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' width='70' height='70' src='assets/img/5g_content/image_card_phone.svg'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3'>Host name</small><dt style='color:#5F6F81'>Test-Android</dt><small style='color:#9EA8B3'>Host name</small><dt style='color:#5F6F81'>Test-Android</dt><small style='color:#9EA8B3'>Host name</small><dt style='color:#5F6F81'>Test-Android</dt></div></div></div></div>";


    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetConnectWifiDevice",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            // var obj = jQuery.parseJSON(msgs);
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Get_Connect_Device_Result == "SUCCESS") {

                if (obj.SSID_A_Status == 1) {
                    $("#SSID_A_Status").html('<span data-locale="common.On">'+ $.i18n.prop("common.On") +'</span>');
                } else if (obj.SSID_A_Status == 0) {
                    $("#SSID_A_Status").html('<span data-locale="common.Off">'+ $.i18n.prop("common.Off") +'</span>');
                }

                if (obj.SSID_B_Status == 1) {
                    $("#SSID_B_Status").text(obj.SSID_B_Name);
                    //$("#SSID_ASSID_B_Status_Status").html('<span data-locale="common.On">'+ $.i18n.prop("common.On") +'</span>');
                    // $('#SSID_B_Status').text('On');
                } else if (obj.SSID_B_Status == 0) {
                    $("#SSID_B_Status").html('<span data-locale="common.Off">'+ $.i18n.prop("common.Off") +'</span>');
                    // $('#SSID_B_Status').text('Off');
                }

                // if (obj.Usb_Status == 1) {
                //     $("#USB_Status").html('<span data-locale="common.On">'+ $.i18n.prop("common.On") +'</span>');
                //     // $('#USB_Status').text('On');
                // } else if (obj.Usb_Status == 0) {
                //     $("#USB_Status").html('<span data-locale="common.Off">'+ $.i18n.prop("common.Off") +'</span>');
                //     // $('#USB_Status').text('Off');
                // }

                // if (obj.Ethernet_Status == 1) {
                //     $("#Ethernet_Status").html('<span data-locale="common.On">'+ $.i18n.prop("common.On") +'</span>');
                //     // $('#Ethernet_Status').text('On');
                // } else if (obj.Ethernet_Status == 0) {
                //     $("#Ethernet_Status").html('<span data-locale="common.Off">'+ $.i18n.prop("common.Off") +'</span>');
                //     // $('#Ethernet_Status').text('Off');
                // }


                var Device_Num = parseInt(obj.SSID_A_Device_Num) + parseInt(obj.SSID_B_Device_Num) + parseInt(obj.Usb_Device_Num) + parseInt(obj.Ethernet_Device_Num);
                if (!Device_Num) Device_Num = 0;
                $('#Device_Num').text(Device_Num);
                $('#SSID_A_Name').text(obj.SSID_A_Name);
                //$('#SSID_B_Name').text(obj.SSID_B_Name);
                var img;
                var display_name;
                var _ssida1 = _ssida2 = _ssida = [];
                _ssida1 = obj.SSID_A_Devices1;
                _ssida2 = obj.SSID_A_Devices2;
                _ssida = _ssida1.concat(_ssida2);
                for (i = 0; i < obj.SSID_A_Device_Num; i++) {
                    switch (_ssida[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_ssida[i].connected_name != "") {
                        display_name = _ssida[i].connected_name;
                    } else {
                        display_name = _ssida[i].dev_name;
                    }
                    //if login
                    if(session_token)
                    {
                        card_A += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt><small style='color:#9EA8B3' data-locale='home.IPAddress'>" + $.i18n.prop("home.IPAddress") + "</small><dt style='color:#5F6F81'>" + _ssida[i].ip_v4 + "</dt><small style='color:#9EA8B3' data-locale='home.MACAddress'>" + $.i18n.prop("home.MACAddress") + "</small><dt style='color:#5F6F81'>" + _ssida[i].mac_addr + "</dt></div></div></div></div>";
                    } 
                    else
                    {
                        card_A += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt></div></div></div></div>";
                    }                    
                }
                $("#SSID_A_card").html(card_A);

                var _ssidb1 = _ssidb2 = _ssidb = [];
                _ssidb1 = obj.SSID_B_Devices1;
                _ssidb2 = obj.SSID_B_Devices2;
                _ssidb = _ssidb1.concat(_ssidb2);

                for (i = 0; i < obj.SSID_B_Device_Num; i++) {
                    switch (_ssidb[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_ssidb[i].connected_name != "") {
                        display_name = _ssidb[i].connected_name;
                    } else {
                        display_name = _ssidb[i].dev_name;
                    }
                    //if login
                    if(session_token)
                    {
                        card_B += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt><small style='color:#9EA8B3' data-locale='home.IPAddress'>" + $.i18n.prop("home.IPAddress") + "</small><dt style='color:#5F6F81'>" + _ssidb[i].ip_v4 + "</dt><small style='color:#9EA8B3' data-locale='home.MACAddress'>" + $.i18n.prop("home.MACAddress") + "</small><dt style='color:#5F6F81'>" + _ssidb[i].mac_addr + "</dt></div></div></div></div>";
                    } 
                    else
                    {
                        card_B += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt></div></div></div></div>";
                    }  
                }
                $("#SSID_B_card").html(card_B);


                var _usb1 = _usb2 = _usb = [];
                _usb1 = obj.Usb_Devices1;
                _usb2 = obj.Usb_Devices2;
                _usb = _usb1.concat(_usb2);
                for (i = 0; i < obj.Usb_Device_Num; i++) {
                    switch (_usb[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_usb[i].connected_name != "") {
                        display_name = _usb[i].connected_name;
                    } else {
                        display_name = _usb[i].dev_name;
                    }
                    //if login
                    if(session_token)
                    {
                        card_USB += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt><small style='color:#9EA8B3' data-locale='home.IPAddress'>" + $.i18n.prop("home.IPAddress") + "</small><dt style='color:#5F6F81'>" + _usb[i].ip_v4 + "</dt><small style='color:#9EA8B3' data-locale='home.MACAddress'>" + $.i18n.prop("home.MACAddress") + "</small><dt style='color:#5F6F81'>" + _usb[i].mac_addr + "</dt></div></div></div></div>";
                    } 
                    else
                    {
                        card_USB += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt></div></div></div></div>";
                    }  
                }
                // $("#USB_card").html(card_USB);


                var _eth1 = _eth2 = _eth = [];
                _eth1 = obj.Ethernet_Devices1;
                _eth2 = obj.Ethernet_Devices2;
                _eth = _eth1.concat(_eth2);                

                for (i = 0; i < obj.Ethernet_Device_Num; i++) {

                    switch (_eth[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_eth[i].connected_name != "") {
                        display_name = _eth[i].connected_name;
                    } else {
                        display_name = _eth[i].dev_name;
                    }
                    //if login
                    if(session_token)
                    {
                        card_Ethernet += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt><small style='color:#9EA8B3' data-locale='home.IPAddress'>" + $.i18n.prop("home.IPAddress") + "</small><dt style='color:#5F6F81'>" + _eth[i].ip_v4 + "</dt><small style='color:#9EA8B3' data-locale='home.MACAddress'>" + $.i18n.prop("home.MACAddress") + "</small><dt style='color:#5F6F81'>" + _eth[i].mac_addr + "</dt></div></div></div></div>";
                    } 
                    else
                    {
                        card_Ethernet += "<div class='col-12 col-md-6 col-lg-6 text-left align-self-center'><div class='card-panel'><div class='row col-12 col-md-12 col-lg-12 text-center' style='padding-right:0px'><div class='col-12 col-md-5 col-lg-5 text-center align-self-center mt-2 mb-2'><img alt='image' class='card-image3' src='" + img + "'></div><div class='col-12 col-md-7 col-lg-7 text-left mt-2 mb-2'><small style='color:#9EA8B3' data-locale='client.list.HostName'>" + $.i18n.prop("client.list.HostName") + "</small><dt style='color:#5F6F81'>" + display_name + "</dt></div></div></div></div>";
                    }    
                }
                $("#Ethernet_card").html(card_Ethernet);

            } else {
                // alert(obj.Get_Connect_Device_Result);            
                alert($.i18n.prop("error.devicefail"));      
                clearSession();          
                return;
            }
            if (callFunc1) {
                callFunc1();
            }


        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}


function GetClientListWIFI() {


    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    //$.LoadingOverlay("show");

    var Error_Msg = "";
    var card_A = card_B = card_USB = card_Ethernet = "";

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetConnectWifiDevice",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            //$.LoadingOverlay("hide");
            // var obj = jQuery.parseJSON(msgs);
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Get_Connect_Device_Result == "SUCCESS") {
                if (obj.SSID_A_Device_Num == 0) {
                    $('#SSID_A_Name').html('<span data-locale="client.list.NoConnectdClient">' + $.i18n.prop("client.list.NoConnectdClient") + '</span>');
                } else {
                    $('#SSID_A_Name').text(obj.SSID_A_Name);
                }

                var _ssida1 = _ssida2 = _ssida = [];
                _ssida1 = obj.SSID_A_Devices1;
                _ssida2 = obj.SSID_A_Devices2;
                _ssida = _ssida1.concat(_ssida2);

                $("#SSID_A_List").val(JSON.stringify(_ssida));

                for (i = 0; i < obj.SSID_A_Device_Num; i++) {

                    switch (_ssida[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_ssida[i].connected_name != "") {
                        display_name = _ssida[i].connected_name;
                    } else {
                        display_name = _ssida[i].dev_name;
                    }

                    card_A += '<div class="col-12 col-md-6 col-lg-4 text-center align-self-center">' +
                        '<div class="card-edit-body">' +
                        '<div class=" row col-12 col-md-12 col-lg-12 text-left align-self-center" style="padding-right:0px">' +
                        '<label class="col-form-label text-center align-self-center col-4 col-md-4 col-lg-4 mt-2">' +
                        '<div class="avatar-item">' +
                        '<img alt="image" class="card-image3" ' +
                        'src="' + img + '"' +
                        'class="img-circle image-responsive" data-toggle="tooltip" title="User">' +
                        '</div>' +
                        '</label>' +
                        '<div class="col-form-label text-left col-8 col-md-8 col-lg-8 align-self-center mt-1">' +
                        '<small style="color:#9EA8B3" data-locale="client.list.HostName">' + $.i18n.prop("client.list.HostName") + '</small>' +
                        '<dt>' + display_name + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.IPAddress">' + $.i18n.prop("home.IPAddress") + '</small>' +
                        '<dt>' + _ssida[i].ip_v4 + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.MACAddress">' + $.i18n.prop("home.MACAddress") + '</small>' +
                        '<dt>' + _ssida[i].mac_addr + '</dt>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-edit-footer">' +
                        '<div class="row text-right mr-1">' +
                        '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmAddtoAllow( \'' + _ssida[i].mac_addr + '\')">' +
                        '<img alt="image" src="assets/img/5g_content/ic_card_footer_filter.svg"><span data-locale="client.list.Filter">' + $.i18n.prop("client.list.Filter") + '</span>' +
                        '</a>' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmEditConnectedType( \'SSID_A_List\' ,  \'' + i + '\')">' +
                        '<img src="assets/img/5g_content/ic_card_footer_edit.svg" alt=""><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                $("#SSID_A_card").html(card_A);

                if (obj.SSID_B_Device_Num == 0) {
                    $('#SSID_B_Name').html('<span data-locale="client.list.NoConnectdClient">' + $.i18n.prop("client.list.NoConnectdClient") + '</span>');
                } else {
                    $('#SSID_B_Name').text(obj.SSID_B_Name);
                }

                var _ssidb1 = _ssidb2 = _ssidb = [];
                _ssidb1 = obj.SSID_B_Devices1;
                _ssidb2 = obj.SSID_B_Devices2;
                _ssidb = _ssidb1.concat(_ssidb2);
                $("#SSID_B_List").val(JSON.stringify(_ssidb));

                for (i = 0; i < obj.SSID_B_Device_Num; i++) {

                    switch (_ssidb[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_ssidb[i].connected_name != "") {
                        display_name = _ssidb[i].connected_name;
                    } else {
                        display_name = _ssidb[i].dev_name;
                    }

                    card_B += '<div class="col-12 col-md-6 col-lg-4 text-center align-self-center">' +
                        '<div class="card-edit-body">' +
                        '<div class=" row col-12 col-md-12 col-lg-12 text-left align-self-center" style="padding-right:0px">' +
                        '<label class="col-form-label text-center align-self-center col-4 col-md-4 col-lg-4 mt-2">' +
                        '<div class="avatar-item">' +
                        '<img alt="image" class="card-image3" ' +
                        'src="' + img + '"' +
                        'class="img-circle image-responsive" data-toggle="tooltip" title="User">' +
                        '</div>' +
                        '</label>' +
                        '<div class="col-form-label text-left col-8 col-md-8 col-lg-8 align-self-center mt-1">' +
                        '<small style="color:#9EA8B3" data-locale="client.list.HostName">' + $.i18n.prop("client.list.HostName") + '</small>' +
                        '<dt>' + display_name + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.IPAddress">' + $.i18n.prop("home.IPAddress") + '</small>' +
                        '<dt>' + _ssidb[i].ip_v4 + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.MACAddress">' + $.i18n.prop("home.MACAddress") + '</small>' +
                        '<dt>' + _ssidb[i].mac_addr + '</dt>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-edit-footer">' +
                        '<div class="row text-right mr-1">' +
                        '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font"  onclick="ConfirmAddtoAllow( \'' + _ssidb[i].mac_addr + '\')">' +
                        '<img alt="image" src="assets/img/5g_content/ic_card_footer_filter.svg"><span data-locale="client.list.Filter">' + $.i18n.prop("client.list.Filter") + '</span>' +
                        '</a>' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmEditConnectedType( \'SSID_B_List\' , \'' + i + '\')">' +
                        '<img src="assets/img/5g_content/ic_card_footer_edit.svg" alt=""><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                $("#SSID_B_card").html(card_B);

                //$('#USB_Name').text(obj.USB_Name);
                if (obj.Usb_Device_Num == 0) {
                    $('#USB_Name').html('<span data-locale="client.list.NoConnectdClient">' + $.i18n.prop("client.list.NoConnectdClient") + '</span>');
                } else {
                    $('#USB_Name').text('');
                }

                var _usb1 = _usb2 = _usb = [];
                _usb1 = obj.Usb_Devices1;
                _usb2 = obj.Usb_Devices2;
                _usb = _usb1.concat(_usb2);
                $("#USB_List").val(JSON.stringify(_usb));

                for (i = 0; i < obj.Usb_Device_Num; i++) {

                    switch (_usb[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_usb[i].connected_name != "") {
                        display_name = _usb[i].connected_name;
                    } else {
                        display_name = _usb[i].dev_name;
                    }

                    card_USB += '<div class="col-12 col-md-6 col-lg-4 text-center align-self-center">' +
                        '<div class="card-edit-body">' +
                        '<div class=" row col-12 col-md-12 col-lg-12 text-left align-self-center" style="padding-right:0px">' +
                        '<label class="col-form-label text-center align-self-center col-4 col-md-4 col-lg-4 mt-2">' +
                        '<div class="avatar-item">' +
                        '<img alt="image" class="card-image3" ' +
                        'src="' + img + '"' +
                        'class="img-circle image-responsive" data-toggle="tooltip" title="User">' +
                        '</div>' +
                        '</label>' +
                        '<div class="col-form-label text-left col-8 col-md-8 col-lg-8 align-self-center mt-1">' +
                        '<small style="color:#9EA8B3" data-locale="client.list.HostName">' + $.i18n.prop("client.list.HostName") + '</small>' +
                        '<dt>' + display_name + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.IPAddress">' + $.i18n.prop("home.IPAddress") + '</small>' +
                        '<dt>' + _usb[i].ip_v4 + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.MACAddress">' + $.i18n.prop("home.MACAddress") + '</small>' +
                        '<dt>' + _usb[i].mac_addr + '</dt>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-edit-footer">' +
                        '<div class="row text-right mr-1">' +
                        '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmAddtoAllow( \'' + _usb[i].mac_addr + '\')">' +
                        '<img alt="image" src="assets/img/5g_content/ic_card_footer_filter.svg"><span data-locale="client.list.Filter">' + $.i18n.prop("client.list.Filter") + '</span>' +
                        '</a>' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmEditConnectedType( \'USB_List\' ,  \'' + i + '\')">' +
                        '<img src="assets/img/5g_content/ic_card_footer_edit.svg" alt=""><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                // $("#USB_card").html(card_USB);

                //$('#Ethernet_Name').text(obj.Ethernet_Name);
                if (obj.Ethernet_Device_Num == 0) {
                    $('#Ethernet_Name').html('<span data-locale="client.list.NoConnectdClient">' + $.i18n.prop("client.list.NoConnectdClient") + '</span>');
                } else {
                    $('#Ethernet_Name').text('');
                }

                var _eth1 = _eth2 = _eth = [];
                _eth1 = obj.Ethernet_Devices1;
                _eth2 = obj.Ethernet_Devices2;
                _eth = _eth1.concat(_eth2);
                $("#Ethernet_List").val(JSON.stringify(_eth));

                for (i = 0; i < obj.Ethernet_Device_Num; i++) {

                    switch (_eth[i].connected_icon) {
                        case "phone":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "pc":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        case "tablet":
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                        default:
                            img = 'assets/img/5g_content/card_image_portrait_small.svg';
                            break;
                    }
                    if (_eth[i].connected_name != "") {
                        display_name = _eth[i].connected_name;
                    } else {
                        display_name = _eth[i].dev_name;
                    }

                    card_Ethernet += '<div class="col-12 col-md-6 col-lg-4 text-center align-self-center">' +
                        '<div class="card-edit-body">' +
                        '<div class=" row col-12 col-md-12 col-lg-12 text-left align-self-center" style="padding-right:0px">' +
                        '<label class="col-form-label text-center align-self-center col-4 col-md-4 col-lg-4 mt-2">' +
                        '<div class="avatar-item">' +
                        '<img alt="image" class="card-image3" ' +
                        'src="' + img + '"' +
                        'class="img-circle image-responsive" data-toggle="tooltip" title="User">' +
                        '</div>' +
                        '</label>' +
                        '<div class="col-form-label text-left col-8 col-md-8 col-lg-8 align-self-center mt-1">' +
                        '<small style="color:#9EA8B3" data-locale="client.list.HostName">' + $.i18n.prop("client.list.HostName") + '</small>' +
                        '<dt>' + display_name + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.IPAddress">' + $.i18n.prop("home.IPAddress") + '</small>' +
                        '<dt>' + _eth[i].ip_v4 + '</dt>' +
                        '<small style="color:#9EA8B3" data-locale="home.MACAddress">' + $.i18n.prop("home.MACAddress") + '</small>' +
                        '<dt>' + _eth[i].mac_addr + '</dt>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-edit-footer">' +
                        '<div class="row text-right mr-1">' +
                        '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmAddtoAllow( \'' + _eth[i].mac_addr + '\')">' +
                        '<img alt="image" src="assets/img/5g_content/ic_card_footer_filter.svg"><span data-locale="client.list.Filter">' + $.i18n.prop("client.list.Filter") + '</span>' +
                        '</a>' +
                        '<a href="#" class="btn btn-icon icon-left card-edit-font" onclick="ConfirmEditConnectedType( \'Ethernet_List\' ,  \'' + i + '\')">' +
                        '<img src="assets/img/5g_content/ic_card_footer_edit.svg" alt=""><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                $("#Ethernet_card").html(card_Ethernet);

            } else {
                alert(obj.Get_Connect_Device_Result);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function backToHome() {
    alert($.i18n.prop("error.Token_mismatch"));
    location.href = 'index.html';
}


function timerIncrement() {
    idleTime = idleTime + 1;
    console.log('idleTime:'+idleTime)
    console.log('Session_inactivity_timeout:'+Session_inactivity_timeout)
    if (idleTime > (Session_inactivity_timeout - 1)) { // 5 minutes default
        alert($.i18n.prop("common.noaction"));
        clearSession();        
    }
}

function WPSTimerIncrement() {
    WPSidleTime = WPSidleTime + 1;
    if (WPSidleTime > 120) { // 5 minutes default
        WPSidleInterval = window.clearInterval(WPSidleInterval);
        location.reload();
    }
}

function GetConfigFirewall() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetConfigFirewall",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            //if (obj.GetGlobalWifiResult == "SUCCESS") {

            if (obj.Firewall_enable == 1) {
                $("#Select_Firewall_enable option[value=1]").prop('selected', true);
            } else {
                $("#Select_Firewall_enable option[value=0]").prop('selected', true);
            }
            if (obj.wan_ping_block == 1) {
                $("#Select_WPB option[value=1]").prop('selected', true);
            } else {
                $("#Select_WPB option[value=0]").prop('selected', true);
            }
            $("#OLD_WPB").val(obj.wan_ping_block);
            $("#pkts_allowed").val(obj.pkts_allowed);
            //KittyLock
            findKittyKey('IpAddressFiltering', 'Select_Firewall_enable');
            findKittyKey('WanPortPingBlock', 'Select_WPB');

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function GetFirewall() {
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetFirewall",
            IP_Type: 4,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            //if (obj.GetGlobalWifiResult == "SUCCESS") {

            if (obj.pkts_allowed == 1) {
                $("#Select_FilterMode_enable option[value=1]").prop('selected', true);
                //$("#list_title").text('Whitelist');
            } else {
                $("#Select_FilterMode_enable option[value=0]").prop('selected', true);
                //$("#list_title").text('Blacklist');
            }


            $("#OLD_Firewall_enable").val(obj.Firewall_enable);
            $("#OLD_pkts_allowed").val(obj.pkts_allowed);
            $("#OLD_entries").val(JSON.stringify(obj.entries));
            // if (obj.Isolation == 1) {
            //   $('#Select_Multi_SSID_status').bootstrapToggle('on');
            // } else if (obj.Isolation == 0) {
            //   $('#Select_Multi_SSID_status').bootstrapToggle('off');
            // }
            var lanip, wanip, _ipsrcaddr, _ipdstaddr, _ipsrcsubnet, _ipdstsubnet, ipv4src_sub, ipv4dst_sub;
            var end_src, src_port, edit_tcpudpsrcport;
            var end_dst, dst_port, edit_tcpudpdstport;
            var iptype = '';
            var ipsrcaddr = '';
            var nxthdrproto = direction = '';
            var _tcpudpsrcrange = _tcpudpdstrange = _tcpudpsrcport = _tcpudpdstport = _direction = _handle = _this = _count = "";
            _count = obj.count;
            var ipv4Count = obj.count;
            if (_count > 0) {
                for (i = 0; i < _count; i++) {

                    if (obj.entries[i].IPversion == 4) {
                        iptype = 'IPv4';
                    } else if (obj.entries[i].IPversion == 6) {
                        iptype = 'IPv6';
                    }
                    switch (obj.entries[i].nxthdrproto) {
                        case "1":
                            nxthdrproto = 'ICMP';
                            break;
                        case "58":
                            nxthdrproto = 'ICMP';
                            break;
                        case "6":
                            nxthdrproto = 'TCP';
                            break;
                        case "17":
                            nxthdrproto = 'UDP';
                            break;
                        case "253":
                            nxthdrproto = 'TCP/UDP';
                            break;
                    }

                    _ipsrcaddr = obj.entries[i].ipsrcaddr;
                    _ipdstaddr = obj.entries[i].ipdstaddr;
                    _ipsrcsubnet = obj.entries[i].ipsrcsubnet;
                    _ipdstsubnet = obj.entries[i].ipdstsubnet;
                    _tcpudpsrcrange = obj.entries[i].tcpudpsrcrange;
                    _tcpudpdstrange = obj.entries[i].tcpudpdstrange;
                    _tcpudpsrcport = obj.entries[i].tcpudpsrcport;
                    _tcpudpdstport = obj.entries[i].tcpudpdstport;
                    _direction = obj.entries[i].direction;
                    _handle = obj.entries[i].handle;

                    if (_direction == "0") {
                        direction = "IN";
                    } else {
                        direction = "OUT";
                    }

                    //IP Reverse

                    ipv4src_sub = confirmEndingReturnSub(_ipsrcsubnet);
                    ipv4dst_sub = confirmEndingWanReturnSub(_ipdstsubnet);
                    if (ipv4src_sub) {
                        _ipsrcaddr = _ipsrcaddr + ipv4src_sub;
                    }
                    if (ipv4dst_sub) {
                        _ipdstaddr = _ipdstaddr + ipv4dst_sub;
                    }

                    //PORT Reverse
                    if (_tcpudpsrcrange > 0) {
                        end_src = parseInt(_tcpudpsrcport) + parseInt(_tcpudpsrcrange);
                        src_port = _tcpudpsrcport + '-' + end_src;
                    } else {
                        src_port = _tcpudpsrcport;
                    }
                    if (_tcpudpdstrange > 0) {
                        end_dst = parseInt(_tcpudpdstport) + parseInt(_tcpudpdstrange);
                        dst_port = _tcpudpdstport + '-' + end_dst;
                    } else {
                        dst_port = _tcpudpdstport;
                    }


                    if (_direction == "1") //IN
                    {
                        //IP
                        lanip = _ipsrcaddr;
                        wanip = _ipdstaddr;
                        edit_tcpudpsrcport = src_port;
                        edit_tcpudpdstport = dst_port;

                    } else //OUT
                    {
                        //IP
                        lanip = _ipdstaddr;
                        wanip = _ipsrcaddr;
                        edit_tcpudpsrcport = dst_port;
                        edit_tcpudpdstport = src_port;
                    }

                    if (edit_tcpudpsrcport == '0') {
                        edit_tcpudpsrcport = '';
                    }
                    if (edit_tcpudpdstport == '0') {
                        edit_tcpudpdstport = '';
                    }

                    if (nxthdrproto == 'ICMP') {
                        edit_tcpudpsrcport = '';
                        edit_tcpudpdstport = '';
                    }

                    card += '<div class="col-12 col-md-6 col-lg-6 text-center align-self-center">' +
                        '<div class="card-edit-body">' +
                        '<div class=" row col-12 col-md-12 col-lg-12 text-left align-self-center">' +
                        '<div class="col-12 col-sm-12 col-md-12 col-lg-4 text-center mt-1">' +
                        '<img class="card-image " alt="image" src="assets/img/5g_content/card_image_network.svg"  style="border:2px solid #ffffff;" data-toggle="tooltip" title="">' +
                        '</div>' +
                        '<div class="col-form-label text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-center mt-1">' +
                        '<small class="card-title-font"><span data-locale="apn.profile.setting.IPType">' + $.i18n.prop("apn.profile.setting.IPType") + '</span></small><dt class="card-empty-font">' + iptype + '</dt>' +
                        '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.LANIPAddr">' + $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr") + '</span></small><dt class="card-empty-font">' + lanip + '</dt>' +
                        '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.WANIPAddr">' + $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr") + '</span></small><dt class="card-empty-font">' + wanip + '</dt>' +
                        '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.Direction">' + $.i18n.prop("lan.settings.IPAddr.Filtering.Direction") + '</span></small><dt>' + direction + '</dt>' +
                        '</div>' +
                        '<div class="col-form-label text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-center mt-1">' +
                        '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.Protocol">' + $.i18n.prop("lan.settings.IPAddr.Filtering.Protocol") + '</span></small><dt class="card-empty-font">' + nxthdrproto + '</dt>' +
                        '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.LANPort">' + $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort") + '</span></small><dt class="card-empty-font">' + edit_tcpudpsrcport + '</dt>' +
                        '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.WANPort">' + $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort") + '</span></small><dt class="card-empty-font">' + edit_tcpudpdstport + '</dt>' +
                        '<small class="card-title-font">&nbsp;</small><dt class="card-empty-font"></dt>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-edit-footer">' +
                        '<div class="row text-right mr-1">' +
                        '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                        '<button class="btn btn-icon icon-left kitty_lock" onclick="ConfirmDeleteDHCPEntries(\'' + _handle + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>' +
                        '<button class="btn btn-icon icon-left kitty_lock" onclick="ConfirmEditDHCPEntries(\'' + i + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                //$("#card").html(card);
            }

            $.ajax({
                type: "POST",
                url: "../../cgi-bin/qcmap_web_cgi",
                data: {
                    Page: "GetFirewall",
                    IP_Type: 6,
                    token: session_token
                },
                dataType: "text",
                success: function (msgs) {
                    var obj = jQuery.parseJSON(msgs);
                    if (obj.result == "AUTH_FAIL") {
                        //clearSession();
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                    }
                    if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                    }
                    if (obj.commit == "Socket Send Error") {
                        clearSession();
                        alert($.i18n.prop("error.SocketSendError"));
                        return;
                    }
                    if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                    }
                    $("#OLD_entries6").val(JSON.stringify(obj.entries));


                    var lanip, wanip, _ipsrcaddr, _ipdstaddr, _ipsrcsubnet, _ipdstsubnet, ipv4src_sub, ipv4dst_sub, _ip6srclen, _ip6dstlen;
                    var end_src, src_port, edit_tcpudpsrcport;
                    var end_dst, dst_port, edit_tcpudpdstport;
                    var iptype = '';
                    var ipsrcaddr = '';
                    var nxthdrproto = direction = '';
                    var _tcpudpsrcrange = _tcpudpdstrange = _tcpudpsrcport = _tcpudpdstport = _direction = _handle = _this = _count = "";
                    _count = obj.count;
                    var ipv6Count = obj.count;

                    for (i = 0; i < obj.count; i++) {
                        var iptype = '';
                        var ipsrcaddr = '';
                        var nxthdrproto = '';
                        if (obj.entries[i].IPversion == 4) {
                            iptype = 'IPv4';
                        } else if (obj.entries[i].IPversion == 6) {
                            iptype = 'IPv6';
                        }
                        switch (obj.entries[i].nxthdrproto) {
                            case "1":
                                nxthdrproto = 'ICMP';
                                break;
                            case "58":
                                nxthdrproto = 'ICMP';
                                break;
                            case "6":
                                nxthdrproto = 'TCP';
                                break;
                            case "17":
                                nxthdrproto = 'UDP';
                                break;
                            case "253":
                                nxthdrproto = 'TCP/UDP';
                                break;
                        }

                        _ipsrcaddr = obj.entries[i].ip6srcaddr;
                        _ipdstaddr = obj.entries[i].ip6dstaddr;
                        _ipsrcsubnet = obj.entries[i].ipsrcsubnet;
                        _ipdstsubnet = obj.entries[i].ipdstsubnet;
                        _tcpudpsrcrange = obj.entries[i].tcpudpsrcrange;
                        _tcpudpdstrange = obj.entries[i].tcpudpdstrange;
                        _tcpudpsrcport = obj.entries[i].tcpudpsrcport;
                        _tcpudpdstport = obj.entries[i].tcpudpdstport;
                        _direction = obj.entries[i].direction;
                        _handle = obj.entries[i].handle;
                        _ip6srclen = obj.entries[i].ip6srclen;
                        _ip6dstlen = obj.entries[i].ip6dstlen;

                        if (_direction == "0") {
                            direction = "IN";
                        } else {
                            direction = "OUT";
                        }

                        //IP Reverse

                        var ipv6src_sub = confirmEnding6(_ip6srclen);
                        var ipv6dst_sub = confirmEnding6(_ip6dstlen);
                        if (ipv6src_sub != 128) {
                            _ipsrcaddr = _ipsrcaddr + '/' + ipv6src_sub;
                        }
                        if (ipv6dst_sub != 128) {
                            _ipdstaddr = _ipdstaddr + '/' + ipv6dst_sub;
                        }

                        //PORT Reverse
                        if (_tcpudpsrcrange > 0) {
                            end_src = parseInt(_tcpudpsrcport) + parseInt(_tcpudpsrcrange);
                            src_port = _tcpudpsrcport + '-' + end_src;
                        } else {
                            src_port = _tcpudpsrcport;
                        }
                        if (_tcpudpdstrange > 0) {
                            end_dst = parseInt(_tcpudpdstport) + parseInt(_tcpudpdstrange);
                            dst_port = _tcpudpdstport + '-' + end_dst;
                        } else {
                            dst_port = _tcpudpdstport;
                        }


                        if (_direction == "1") //IN
                        {
                            //IP
                            lanip = _ipsrcaddr;
                            wanip = _ipdstaddr;
                            edit_tcpudpsrcport = src_port;
                            edit_tcpudpdstport = dst_port;

                        } else //OUT
                        {
                            //IP
                            lanip = _ipdstaddr;
                            wanip = _ipsrcaddr;
                            edit_tcpudpsrcport = dst_port;
                            edit_tcpudpdstport = src_port;
                        }

                        if (nxthdrproto == 'ICMP') {
                            edit_tcpudpsrcport = '';
                            edit_tcpudpdstport = '';
                        }


                        card += '<div class="col-12 col-md-6 col-lg-6 text-center align-self-center">' +
                            '<div class="card-edit-body">' +
                            '<div class=" row col-12" style="margin-left:0px; margin-right:0px; padding-top:10px; padding-bottom: 10px;">' +
                            '<div class="col-12 col-md-12 col-lg-4 text-center mt-1">' +
                            '<img class="card-image " alt="image" src="assets/img/5g_content/card_image_network.svg">' +
                            '</div>' +
                            '<div class="col-form-label text-left col-12 col-md-5 col-lg-4 align-self-center mt-1">' +
                            '<small class="card-title-font"><span data-locale="apn.profile.setting.IPType">' + $.i18n.prop("apn.profile.setting.IPType") + '</span></small><dt class="card-empty-font">' + iptype + '</dt>' +
                            '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.LANIPAddr">' + $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr") + '</span></small><dt class="card-empty-font">' + lanip + '</dt>' +
                            '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.WANIPAddr">' + $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr") + '</span></small><dt class="card-empty-font">' + wanip + '</dt>' +
                            '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.Direction">' + $.i18n.prop("lan.settings.IPAddr.Filtering.Direction") + '</span></small><dt>' + direction + '</dt>' +
                            '</div>' +
                            '<div class="col-form-label text-left col-12 col-md-3 col-lg-4 align-self-center mt-1">' +
                            '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.Protocol">' + $.i18n.prop("lan.settings.IPAddr.Filtering.Protocol") + '</span></small><dt class="card-empty-font">' + nxthdrproto + '</dt>' +
                            '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.LANPort">' + $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort") + '</span></small><dt class="card-empty-font">' + edit_tcpudpsrcport + '</dt>' +
                            '<small class="card-title-font"><span data-locale="lan.settings.IPAddr.Filtering.WANPort">' + $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort") + '</span></small><dt class="card-empty-font">' + edit_tcpudpdstport + '</dt>' +
                            '<small class="card-title-font">&nbsp;</small><dt class="card-empty-font"></dt>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="card-edit-footer">' +
                            '<div class="row text-right mr-1">' +
                            '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                            '<button class="btn btn-icon icon-left kitty_lock" onclick="ConfirmDeleteDHCPEntries(\'' + _handle + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>' +
                            '<button class="btn btn-icon icon-left kitty_lock" onclick="ConfirmEditDHCPEntries6(\'' + i + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }
                    if (card != "") {
                        $("#card").html(card);
                    }
                    //KittyLock
                    findKittyKey('IpAddressFiltering', 'addLANIPLock');
                    findKittyKey('IpAddressFiltering', 'apply_lock');
                    findKittyKey('IpAddressFiltering', 'EditDHCPEntries_lock');
                    findKittyKey('IpAddressFiltering', 'DeleteDHCPEntries_lock');

                    findKittyKeyClass('IpAddressFiltering', 'kitty_lock');

                    $("#totalCount").val(parseInt(ipv4Count)+parseInt(ipv6Count))
                },
                error: function (xhr, textStatus, errorThrown) {
                    clearSession();
                    //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                }
            });


        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}

function SetFirewall(mask) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    $.LoadingOverlay("show");
    var Select_Firewall_enable = $("#Select_Firewall_enable").val();
    var pkts_allowed = $("#pkts_allowed").val();

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetFirewall",
            mask: mask,
            config_state: Select_Firewall_enable,
            config_pkts: pkts_allowed,
            firewallhandle: "0",
            ipversion: "0",
            nxthdrprotovld: "0",
            nxthdrproto: "0",
            tcpudpsrcvld: "0",
            tcpudpsrcport: "0",
            tcpudpsrcrange: "0",
            tcpudpdstvld: "0",
            tcpudpdstport: "0",
            tcpudpdstrange: "0",
            icmptypvld: "0",
            icmptyp: "0",
            icmpcodevld: "0",
            icmpcode: "0",
            espspivld: "0",
            espspi: "0",
            ipsrcvld: "0",
            ipsrcaddr: "0",
            ipsrcsubnet: "0",
            iptosvld: "0",
            iptosvlv: "0",
            iptosmsk: "0",
            ip6srcvld: "0",
            ip6srcaddr: "0",
            ip6srclen: "0",
            ip6trsclfvld: "0",
            ip6trsclfvlv: "0",
            ip6trsclfmsk: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.result == "SUCCESS") {
                var OLD_WPB = $("#OLD_WPB").val();
                var Select_WPB = $("#Select_WPB").val();
                if (OLD_WPB == Select_WPB) {
                    alert($.i18n.prop("success.message"));
                    location.reload();
                } else {
                    SetWanPingBlock();
                }

            } else {
                alert(obj.result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetWanPingBlock() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    $.LoadingOverlay("show");
    var wan_ping_block = $("#Select_WPB").val();

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetWanPingBlock",
            wan_ping_block: wan_ping_block,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                alert(obj.result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function ConfirmSetFirewallEnable() {
    var Select_Firewall_enable = $("#OLD_Firewall_enable").val();
    if (Select_Firewall_enable == "1") {
        SetFirewallEnable();
    } else {
        $('#ConfirmSetFirewallEnable').modal('show');
    }

}

function SetFirewallEnable() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    $.LoadingOverlay("show");
    var Select_Firewall_enable = 1;
    var Select_FilterMode_enable = $("#Select_FilterMode_enable").val();

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetFirewall",
            mask: 4,
            config_state: Select_Firewall_enable,
            config_pkts: Select_FilterMode_enable,
            firewallhandle: "0",
            ipversion: "0",
            nxthdrprotovld: "0",
            nxthdrproto: "0",
            tcpudpsrcvld: "0",
            tcpudpsrcport: "0",
            tcpudpsrcrange: "0",
            tcpudpdstvld: "0",
            tcpudpdstport: "0",
            tcpudpdstrange: "0",
            icmptypvld: "0",
            icmptyp: "0",
            icmpcodevld: "0",
            icmpcode: "0",
            espspivld: "0",
            espspi: "0",
            ipsrcvld: "0",
            ipsrcaddr: "0",
            ipsrcsubnet: "0",
            iptosvld: "0",
            iptosvlv: "0",
            iptosmsk: "0",
            ip6srcvld: "0",
            ip6srcaddr: "0",
            ip6srclen: "0",
            ip6trsclfvld: "0",
            ip6trsclfvlv: "0",
            ip6trsclfmsk: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                alert(obj.result);
                return;
            }
            // $("#phone_number").text(obj.phone_number);
            // $("#imei").text(obj.imei);
            // var firmware_version = obj.major + obj.minor;
            // $("#firmware_version").text(firmware_version);
            // var hardware_version = obj.hwrev;
            // $("#hardware_version").text(hardware_version);



        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}


function addLANIP(mask) {
    var ipsrcvld, ipdstvld, ipsrcaddr, ipdstaddr, ip6srcvld, ip6dstvld, ip6srcaddr, ip6dstaddr, ipdstsubnet, ip6dstlen, direction, r_tcpudpsrcport, r_tcpudpdstport, r_tcpudpsrcrange, r_tcpudpdstrange, r2_tcpudpsrcport, r2_tcpudpdstport, r2_tcpudpsrcrange, r2_tcpudpdstrange;
    var tcpudpsrcvld, tcpudpdstvld;
    var ipversion = $("#ipversion").val();
    var nxthdrproto = $("#nxthdrproto").val();
    var config_state = $("#OLD_Firewall_enable").val();
    var config_pkts = $("#OLD_pkts_allowed").val();
    var direction = $("#direction").val();
    var _ipsrcaddr = $("#ipsrcaddr").val();
    var _ipdstaddr = $("#ipdstaddr").val();
    var obj_check;

    if (ipversion == 4) {
        ipsrcvld = 1;
        ipdstvld = 1;
        ipsrcaddr = $("#ipsrcaddr").val();
        ipdstaddr = $("#ipdstaddr").val();
        ip6srcvld = 0;
        ip6dstvld = 0;
        ip6srcaddr = 0;
        ip6dstaddr = 0;
        //ipdstsubnet = "255.255.255.255";
        ip6dstlen = 0;
        ip6srclen = 0;
        //var IPV4_SRC_VALID = ValidateIPV4("ipsrcaddr");
    } else if (ipversion == 6) {
        ipsrcvld = 0;
        ipdstvld = 0;
        ipsrcaddr = 0;
        ipdstaddr = 0;
        ip6srcvld = 1;
        ip6dstvld = 1;
        ip6srcaddr = $("#ipsrcaddr").val();
        ip6dstaddr = $("#ipdstaddr").val();
        //ipdstsubnet = 0;
        ip6dstlen = 128;
        ip6srclen = 128;
        //var IPV6_SRC_VALID = ValidateIPV6("ipsrcaddr");
    }
    //var tcpudpsrcport = $("#tcpudpsrcport").val();
    //var tcpudpdstport = $("#tcpudpdstport").val();
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = addIPEntries_check(ipversion, nxthdrproto);
    //flag = false;
    if (flag) {

        //check counts not more than 50
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetFirewall",
                IP_Type: 4,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }

                if (ipversion == 4) obj_check = obj;
                var ipv4_count = parseInt(obj.count);

                //get ipv6 counts
                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_web_cgi",
                    data: {
                        Page: "GetFirewall",
                        IP_Type: 6,
                        token: session_token
                    },
                    dataType: "text",
                    success: function (msgs) {
                        var obj = jQuery.parseJSON(msgs);
                        if (obj.result == "AUTH_FAIL") {
                            //clearSession();
                            clearSession();
                            alert($.i18n.prop("error.AUTH_FAIL"));
                            return;
                        }
                        if (obj.result == "Token_mismatch") {
                            clearSession();
                            alert($.i18n.prop("error.Token_mismatch"));
                            return;
                        }
                        if (obj.commit == "Socket Send Error") {
                            clearSession();
                            alert($.i18n.prop("error.SocketSendError"));
                            return;
                        }
                        if (obj.result == "QTApp_Login") {
                            clearSession();
                            alert($.i18n.prop("common.Routerdeviceinuse"));
                            return;
                        }
                        if (ipversion == 6) obj_check = obj;
                        var ipv6_count = parseInt(obj.count);
                        var all_count = ipv4_count + ipv6_count;
                        if(all_count >= 50)
                        {
                            alert($.i18n.prop("error.addportmappingmore50"));
                        }
                        else
                        {
                            // Ex.
                            // WAN IP:Port 10.57.1.2:80
                            // LAN IP:Port 192.168.225.10:8080

                            // In Upload (OUT):
                            // Source is 192.168.225.10:8080
                            // Destination is 10.57.1.2:80

                            // In Download (IN):
                            // Source is 10.57.1.2:80
                            // Destination is 192.168.225.10:8080

                            var o_tcpudpsrcport = $("#tcpudpsrcport").val();
                            var o_tcpudpdstport = $("#tcpudpdstport").val();
                            var port_any_flag = checkPortIsAny('tcpudpsrcport');
                            var port_range_flag = checkPortIsRange('tcpudpsrcport');
                            if (port_any_flag) {
                                r_tcpudpsrcport = 1;
                                r_tcpudpsrcrange = 65534;
                            } else if (port_range_flag) {
                                var temp = o_tcpudpsrcport.split("-");
                                var str_0 = parseInt(temp[0]);
                                var str_1 = parseInt(temp[1]);
                                r_tcpudpsrcport = str_0;
                                r_tcpudpsrcrange = str_1 - str_0;
                            } else {
                                r_tcpudpsrcport = $("#tcpudpsrcport").val();
                                r_tcpudpsrcrange = 0;
                            }
                            //=======
                            var port_any_flag2 = checkPortIsAny('tcpudpdstport');
                            var port_range_flag2 = checkPortIsRange('tcpudpdstport');
                            if (port_any_flag2) {
                                r2_tcpudpdstport = 1;
                                r2_tcpudpdstrange = 65534;
                            } else if (port_range_flag2) {
                                var temp2 = o_tcpudpdstport.split("-");
                                var str2_0 = parseInt(temp2[0]);
                                var str2_1 = parseInt(temp2[1]);
                                r2_tcpudpdstport = str2_0;
                                r2_tcpudpdstrange = str2_1 - str2_0;
                            } else {
                                r2_tcpudpdstport = $("#tcpudpdstport").val();
                                r2_tcpudpdstrange = 0;
                            }
                            if (ipversion == 4) {
                                var Netmask = ValidateIPV4andReturnValue("ipsrcaddr");
                                if (Netmask) {
                                    var _ipsrcaddrArray = _ipsrcaddr.split("/");
                                    _ipsrcaddr = _ipsrcaddrArray[0];                                    
                                } else {
                                    Netmask = 0;
                                }
                                var Netmask2 = ValidateIPV4andReturnValueWAN("ipdstaddr");
                                if (Netmask2) {
                                    var _ipdstaddrArray = _ipdstaddr.split("/");
                                    _ipdstaddr = _ipdstaddrArray[0];
                                    //_ipdstaddr = _ipdstaddr.substring(0, _ipdstaddr.length - 3);
                                } else {
                                    Netmask2 = 0;
                                }
                            } else {
                                var Netmask_6 = ValidateIPV6andReturnValue("ipsrcaddr");
                                if (Netmask_6>=0) {
                                    var _temp = _ipsrcaddr.split("/");
                                    _ipsrcaddr = _temp[0];
                                } else {
                                    Netmask_6 = 128;
                                }
                                var Netmask2_6 = ValidateIPV6andReturnValue("ipdstaddr");
                                if (Netmask2_6>=0) {
                                    var _temp2 = _ipdstaddr.split("/");
                                    _ipdstaddr = _temp2[0];
                                } else {
                                    Netmask2_6 = 128;
                                }
                            }
                            //return false;

                            if (direction == "1") { //IN
                                if (ipversion == 4) {
                                    ipsrcvld = 1;
                                    ipdstvld = 1;
                                    ipsrcaddr = _ipsrcaddr;
                                    ipdstaddr = _ipdstaddr;
                                    ip6srcvld = 0;
                                    ip6dstvld = 0;
                                    ip6srcaddr = 0;
                                    ip6dstaddr = 0;
                                    tcpudpsrcvld = 1;
                                    tcpudpdstvld = 1;
                                    //ipdstsubnet = "255.255.255.255";
                                    ip6dstlen = 0;
                                    ip6srclen = 0;
                                    tcpudpsrcport = r_tcpudpsrcport;
                                    tcpudpdstport = r2_tcpudpdstport;
                                    tcpudpsrcrange = r_tcpudpsrcrange;
                                    tcpudpdstrange = r2_tcpudpdstrange;
                                    ipsrcsubnet = Netmask ? Netmask : "255.255.255.255";
                                    ipdstsubnet = Netmask2 ? Netmask2 : "255.255.255.255";
                                    //var IPV4_SRC_VALID = ValidateIPV4("ipsrcaddr");
                                } else if (ipversion == 6) {
                                    ipsrcvld = 0;
                                    ipdstvld = 0;
                                    ipsrcaddr = 0;
                                    ipdstaddr = 0;
                                    ip6srcvld = 1;
                                    ip6dstvld = 1;
                                    ip6srcaddr = _ipsrcaddr; //
                                    ip6dstaddr = _ipdstaddr; //
                                    tcpudpsrcvld = 1;
                                    tcpudpdstvld = 1;
                                    //ipdstsubnet = 0;
                                    ip6dstlen = (Netmask2_6>=0) ? Netmask2_6 : 128;
                                    ip6srclen = (Netmask_6>=0) ? Netmask_6 : 128;
                                    tcpudpsrcport = r_tcpudpsrcport;
                                    tcpudpdstport = r2_tcpudpdstport;
                                    tcpudpsrcrange = r_tcpudpsrcrange;
                                    tcpudpdstrange = r2_tcpudpdstrange;
                                    ipsrcsubnet = 0;
                                    ipdstsubnet = 0;
                                }
                            } else { // OUT
                                if (ipversion == 4) {
                                    ipsrcvld = 1;
                                    ipdstvld = 1;
                                    ipsrcaddr = _ipdstaddr;
                                    ipdstaddr = _ipsrcaddr;
                                    ip6srcvld = 0;
                                    ip6dstvld = 0;
                                    ip6srcaddr = 0;
                                    ip6dstaddr = 0;
                                    tcpudpsrcvld = 1;
                                    tcpudpdstvld = 1;
                                    //ipdstsubnet = "255.255.255.255";
                                    ip6dstlen = 0;
                                    ip6srclen = 0;
                                    tcpudpsrcport = r2_tcpudpdstport;
                                    tcpudpdstport = r_tcpudpsrcport;
                                    tcpudpsrcrange = r2_tcpudpdstrange;
                                    tcpudpdstrange = r_tcpudpsrcrange;
                                    //var IPV4_SRC_VALID = ValidateIPV4("ipsrcaddr");
                                    ipsrcsubnet = Netmask2 ? Netmask2 : "255.255.255.255";
                                    ipdstsubnet = Netmask ? Netmask : "255.255.255.255";
                                } else if (ipversion == 6) {
                                    ipsrcvld = 0;
                                    ipdstvld = 0;
                                    ipsrcaddr = 0;
                                    ipdstaddr = 0;
                                    ip6srcvld = 1;
                                    ip6dstvld = 1;
                                    ip6srcaddr = _ipdstaddr;
                                    ip6dstaddr = _ipsrcaddr;
                                    tcpudpsrcvld = 1;
                                    tcpudpdstvld = 1;
                                    //ipdstsubnet = 0;
                                    ip6dstlen = (Netmask_6>=0) ? Netmask_6 : 128;
                                    ip6srclen = (Netmask2_6>=0) ? Netmask2_6 : 128;
                                    tcpudpsrcport = r2_tcpudpdstport;
                                    tcpudpdstport = r_tcpudpsrcport;
                                    tcpudpsrcrange = r2_tcpudpdstrange;
                                    tcpudpdstrange = r_tcpudpsrcrange;
                                    ipsrcsubnet = 0;
                                    ipdstsubnet = 0;
                                    //var IPV6_SRC_VALID = ValidateIPV6("ipsrcaddr");
                                }
                            }

                            if (nxthdrproto == "1") { //ICMP
                                tcpudpsrcvld = 0;
                                tcpudpdstvld = 0;
                                tcpudpsrcport = 0;
                                tcpudpdstport = 0;
                                if (ipversion == 6) {
                                    nxthdrproto = "58";
                                }
                            }

                            for (i = 0; i < obj_check.count; i++) { // Check rule conflict of port

                                if ( direction != obj_check.entries[i].direction ) continue;
                                if ( nxthdrproto != obj_check.entries[i].nxthdrproto ) continue;

                                if ( ipversion == 4 ) {
                                    if ( ipsrcaddr != obj_check.entries[i].ipsrcaddr ) continue;
                                    if ( ipsrcsubnet != obj_check.entries[i].ipsrcsubnet ) continue;
                                    if ( ipdstaddr != obj_check.entries[i].ipdstaddr ) continue;
                                    if ( ipdstsubnet != obj_check.entries[i].ipdstsubnet ) continue;
                                }

                                if ( ipversion == 6 ) {
                                    if ( ip6srcaddr != obj_check.entries[i].ip6srcaddr ) continue;
                                    if ( ip6srclen != obj_check.entries[i].ip6srclen ) continue;
                                    if ( ip6dstaddr != obj_check.entries[i].ip6dstaddr ) continue;
                                    if ( ip6dstlen != obj_check.entries[i].ip6dstlen ) continue;
                                }

                                var i_tcpudpsrcport = parseInt(tcpudpsrcport);
                                var i_tcpudpdstport = parseInt(tcpudpdstport);
                                var i_tcpudpsrcrange = parseInt(tcpudpsrcrange);
                                var i_tcpudpdstrange = parseInt(tcpudpdstrange);
                                var e_tcpudpsrcport = parseInt(obj_check.entries[i].tcpudpsrcport);
                                var e_tcpudpdstport = parseInt(obj_check.entries[i].tcpudpdstport);
                                var e_tcpudpsrcrange = parseInt(obj_check.entries[i].tcpudpsrcrange);
                                var e_tcpudpdstrange = parseInt(obj_check.entries[i].tcpudpdstrange);

                                if ( i_tcpudpsrcport >= e_tcpudpsrcport && i_tcpudpdstport >= e_tcpudpdstport &&
                                     (i_tcpudpsrcport + i_tcpudpsrcrange) <= (e_tcpudpsrcport + e_tcpudpsrcrange) &&
                                     (i_tcpudpdstport + i_tcpudpdstrange) <= (e_tcpudpdstport + e_tcpudpdstrange) )
                                {
                                    alert($.i18n.prop("lan.settings.IPAddr.Filtering.RuleDupDesc"));
                                    return;
                                }
                            }

                            var form = {
                                Page: "SetFirewall",
                                mask: "1",
                                config_state: config_state,
                                config_pkts: config_pkts,
                                firewallhandle: "0",
                                ipversion: ipversion,
                                nxthdrprotovld: "1",
                                nxthdrproto: nxthdrproto,
                                tcpudpsrcvld: tcpudpsrcvld,
                                tcpudpsrcport: tcpudpsrcport,
                                tcpudpsrcrange: tcpudpsrcrange,
                                tcpudpdstvld: tcpudpdstvld,
                                tcpudpdstport: tcpudpdstport,
                                tcpudpdstrange: tcpudpdstrange,
                                icmptypvld: "0",
                                icmptyp: "0",
                                icmpcodevld: "0",
                                icmpcode: "0",
                                espspivld: "0",
                                espspi: "0",
                                ipsrcvld: ipsrcvld,
                                ipsrcaddr: ipsrcaddr,
                                ipsrcsubnet: ipsrcsubnet,
                                iptosvld: "0",
                                iptosvlv: "0",
                                iptosmsk: "0",
                                ip6srcvld: ip6srcvld,
                                ip6srcaddr: ip6srcaddr,
                                ip6srclen: ip6srclen,
                                ip6trsclfvld: "0",
                                ip6trsclfvlv: "0",
                                ip6trsclfmsk: "0",
                                ipdstvld: ipdstvld,
                                ipdstaddr: ipdstaddr,
                                ipdstsubnet: ipdstsubnet,
                                ip6dstvld: ip6dstvld,
                                ip6dstaddr: ip6dstaddr,
                                ip6dstlen: ip6dstlen,
                                direction: direction,
                                token: session_token
                            };
                            var flag2;
                            flag2 = true;
                            if (flag2) {
                                ipsrcaddr = ipsrcaddr.toString().trim();
                                ipdstaddr = ipdstaddr.toString().trim();
                                ip6srcaddr = ip6srcaddr.toString().trim();
                                ip6dstaddr = ip6dstaddr.toString().trim();

                                $.LoadingOverlay("show");
                                $.ajax({
                                    type: "POST",
                                    url: "../../cgi-bin/qcmap_web_cgi",
                                    data: {
                                        Page: "SetFirewall",
                                        mask: "1",
                                        config_state: config_state,
                                        config_pkts: config_pkts,
                                        firewallhandle: "0",
                                        ipversion: ipversion,
                                        nxthdrprotovld: "1",
                                        nxthdrproto: nxthdrproto,
                                        tcpudpsrcvld: tcpudpsrcvld,
                                        tcpudpsrcport: tcpudpsrcport,
                                        tcpudpsrcrange: tcpudpsrcrange,
                                        tcpudpdstvld: tcpudpdstvld,
                                        tcpudpdstport: tcpudpdstport,
                                        tcpudpdstrange: tcpudpdstrange,
                                        icmptypvld: "0",
                                        icmptyp: "0",
                                        icmpcodevld: "0",
                                        icmpcode: "0",
                                        espspivld: "0",
                                        espspi: "0",
                                        ipsrcvld: ipsrcvld,
                                        ipsrcaddr: ipsrcaddr,
                                        ipsrcsubnet: ipsrcsubnet,
                                        iptosvld: "0",
                                        iptosvlv: "0",
                                        iptosmsk: "0",
                                        ip6srcvld: ip6srcvld,
                                        ip6srcaddr: ip6srcaddr,
                                        ip6srclen: ip6srclen,
                                        ip6trsclfvld: "0",
                                        ip6trsclfvlv: "0",
                                        ip6trsclfmsk: "0",
                                        ipdstvld: ipdstvld,
                                        ipdstaddr: ipdstaddr,
                                        ipdstsubnet: ipdstsubnet,
                                        ip6dstvld: ip6dstvld,
                                        ip6dstaddr: ip6dstaddr,
                                        ip6dstlen: ip6dstlen,
                                        direction: direction,
                                        token: session_token
                                    },
                                    dataType: "text",
                                    success: function (msgs) {
                                        $.LoadingOverlay("hide");
                                        var obj = jQuery.parseJSON(msgs);
                                        if (obj.result == "AUTH_FAIL") {
                                            //clearSession();
                                            clearSession();
                                            alert($.i18n.prop("error.AUTH_FAIL"));
                                            return;
                                        }
                                        if (obj.result == "Token_mismatch") {
                                            clearSession();
                                            alert($.i18n.prop("error.Token_mismatch"));
                                            return;
                                        }
                                        if (obj.commit == "Socket Send Error") {
                                            clearSession();
                                            alert($.i18n.prop("error.SocketSendError"));
                                            return;
                                        }
                                        if (obj.result == "QTApp_Login") {
                                            clearSession();
                                            alert($.i18n.prop("common.Routerdeviceinuse"));
                                            return;
                                        }
                                        if (obj.result == "SUCCESS") {

                                            alert($.i18n.prop("success.message"));
                                            location.reload();

                                        } else if (obj.result == "NO EFFECT") {
                                            alert($.i18n.prop("lan.settings.IPAddr.Filtering.RuleDupDesc"));
                                            return;
                                        } else {
                                            alert($.i18n.prop("error.invalidformat"));
                                            return;
                                        }

                                    },
                                    error: function (xhr, textStatus, errorThrown) {
                                        //$.LoadingOverlay("hide");
                                        clearSession();
                                        //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    } // end of flag
}

function ConfirmDeleteDHCPEntries(firewallhandle) {
    $("#firewallhandle").val(firewallhandle);
    $('#deleteLANIP').modal('show');
}

function DeleteDHCPEntries() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var firewallhandle = $("#firewallhandle").val();
    var Error_Msg = "";
    $.LoadingOverlay("show");
    var config_state = $("#OLD_Firewall_enable").val();
    var config_pkts = $("#OLD_pkts_allowed").val();

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetFirewall",
            mask: 2,
            config_state: config_state,
            config_pkts: config_pkts,
            firewallhandle: firewallhandle,
            ipversion: "0",
            nxthdrprotovld: "0",
            nxthdrproto: "0",
            tcpudpsrcvld: "0",
            tcpudpsrcport: "0",
            tcpudpsrcrange: "0",
            tcpudpdstvld: "0",
            tcpudpdstport: "0",
            tcpudpdstrange: "0",
            icmptypvld: "0",
            icmptyp: "0",
            icmpcodevld: "0",
            icmpcode: "0",
            espspivld: "0",
            espspi: "0",
            ipsrcvld: "0",
            ipsrcaddr: "0",
            ipsrcsubnet: "0",
            iptosvld: "0",
            iptosvlv: "0",
            iptosmsk: "0",
            ip6srcvld: "0",
            ip6srcaddr: "0",
            ip6srclen: "0",
            ip6trsclfvld: "0",
            ip6trsclfvlv: "0",
            ip6trsclfmsk: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                alert(obj.result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function ConfirmEditDHCPEntries(i) {
    var temp = $("#OLD_entries").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    $("#firewallhandle").val(entries.handle);
    //var edit_ipversion = entries.ipversion;
    if (entries.IPversion == "4") {
        $("#edit_ipversion option[value=4]").prop('selected', true);
    } else if (entries.IPversion == "6") {
        $("#edit_ipversion option[value=6]").prop('selected', true);
    }
    switch (String(entries.nxthdrproto)) {
        case "253":
            $("#edit_nxthdrproto option[value='253']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").show();
            $("#edit_tcpudpdstport_section").show();
            break;
        case "6":
            $("#edit_nxthdrproto option[value='6']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").show();
            $("#edit_tcpudpdstport_section").show();
            break;
        case "17":
            $("#edit_nxthdrproto option[value='17']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").show();
            $("#edit_tcpudpdstport_section").show();
            break;
        case "1":
            $("#edit_nxthdrproto option[value='1']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").hide();
            $("#edit_tcpudpdstport_section").hide();
        case "58": //ICMP for v6 is 58
            $("#edit_nxthdrproto option[value='1']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").hide();
            $("#edit_tcpudpdstport_section").hide();
            break;
    }

    switch (String(entries.direction)) {
        case "0":
            $("#edit_direction option[value='0']").prop('selected', true);
            break;
        case "1":
            $("#edit_direction option[value='1']").prop('selected', true);
            break;
    }

    var lanip, wanip;
    var end_src, src_port, edit_tcpudpsrcport;
    var end_dst, dst_port, edit_tcpudpdstport;
    var _ipsrcaddr = entries.ipsrcaddr;
    var _ipdstaddr = entries.ipdstaddr;

    //IP Reverse

    var ipv4src_sub = confirmEndingReturnSub(entries.ipsrcsubnet);
    var ipv4dst_sub = confirmEndingWanReturnSub(entries.ipdstsubnet);
    if (ipv4src_sub) {
        _ipsrcaddr = _ipsrcaddr + ipv4src_sub;
    }
    if (ipv4dst_sub) {
        _ipdstaddr = _ipdstaddr + ipv4dst_sub;
    }

    //PORT Reverse
    if (entries.tcpudpsrcrange > 0) {
        end_src = parseInt(entries.tcpudpsrcport) + parseInt(entries.tcpudpsrcrange);
        src_port = entries.tcpudpsrcport + '-' + end_src;
    } else {
        src_port = entries.tcpudpsrcport;
    }
    if (entries.tcpudpdstrange > 0) {
        end_dst = parseInt(entries.tcpudpdstport) + parseInt(entries.tcpudpdstrange);
        dst_port = entries.tcpudpdstport + '-' + end_dst;
    } else {
        dst_port = entries.tcpudpdstport;
    }


    if (entries.direction == "1") //IN
    {
        //IP
        lanip = _ipsrcaddr;
        wanip = _ipdstaddr;
        edit_tcpudpsrcport = src_port;
        edit_tcpudpdstport = dst_port;

    } else //OUT
    {
        //IP
        lanip = _ipdstaddr;
        wanip = _ipsrcaddr;
        edit_tcpudpsrcport = dst_port;
        edit_tcpudpdstport = src_port;
    }

    if(edit_tcpudpsrcport=='0') {
        edit_tcpudpsrcport = ''
    }
    if(edit_tcpudpdstport=='0') {
        edit_tcpudpdstport = ''
    }

    $("#edit_ipsrcaddr").val(lanip);
    $("#edit_tcpudpsrcport").val(edit_tcpudpsrcport);
    $("#edit_ipdstaddr").val(wanip);
    $("#edit_tcpudpdstport").val(edit_tcpudpdstport);
    $("#edit_ip_type").val('4');

    $('#editLANIP').modal('show');
}

function ConfirmEditDHCPEntries6(i) {
    var temp = $("#OLD_entries6").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    $("#firewallhandle").val(entries.handle);
    //var edit_ipversion = entries.ipversion;
    if (entries.IPversion == "4") {
        $("#edit_ipversion option[value=4]").prop('selected', true);
    } else if (entries.IPversion == "6") {
        $("#edit_ipversion option[value=6]").prop('selected', true);
    }

    switch (String(entries.nxthdrproto)) {
        case "253":
            $("#edit_nxthdrproto option[value='253']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").show();
            $("#edit_tcpudpdstport_section").show();
            break;
        case "6":
            $("#edit_nxthdrproto option[value='6']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").show();
            $("#edit_tcpudpdstport_section").show();
            break;
        case "17":
            $("#edit_nxthdrproto option[value='17']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").show();
            $("#edit_tcpudpdstport_section").show();
            break;
        case "1":
            $("#edit_nxthdrproto option[value='1']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").hide();
            $("#edit_tcpudpdstport_section").hide();
            break;
        case "58": //ICMP for v6 is 58
            $("#edit_nxthdrproto option[value='1']").prop('selected', true);
            $("#edit_tcpudpsrcport_section").hide();
            $("#edit_tcpudpdstport_section").hide();
            break;
    }

    switch (String(entries.direction)) {
        case "0":
            $("#edit_direction option[value='0']").prop('selected', true);
            break;
        case "1":
            $("#edit_direction option[value='1']").prop('selected', true);
            break;
    }

    var lanip, wanip;
    var end_src, src_port, edit_tcpudpsrcport;
    var end_dst, dst_port, edit_tcpudpdstport;
    var _ipsrcaddr = entries.ip6srcaddr;
    var _ipdstaddr = entries.ip6dstaddr;

    //IP Reverse

    var ipv6src_sub = confirmEnding6(entries.ip6srclen);
    var ipv6dst_sub = confirmEnding6(entries.ip6dstlen);
    if (ipv6src_sub != 128) {
        _ipsrcaddr = _ipsrcaddr + '/' + ipv6src_sub;
    }
    if (ipv6dst_sub != 128) {
        _ipdstaddr = _ipdstaddr + '/' + ipv6dst_sub;
    }

    //PORT Reverse
    if (entries.tcpudpsrcrange > 0) {
        end_src = parseInt(entries.tcpudpsrcport) + parseInt(entries.tcpudpsrcrange);
        src_port = entries.tcpudpsrcport + '-' + end_src;
    } else {
        src_port = entries.tcpudpsrcport;
    }
    if (entries.tcpudpdstrange > 0) {
        end_dst = parseInt(entries.tcpudpdstport) + parseInt(entries.tcpudpdstrange);
        dst_port = entries.tcpudpdstport + '-' + end_dst;
    } else {
        dst_port = entries.tcpudpdstport;
    }


    if (entries.direction == "1") //IN
    {
        //IP
        lanip = _ipsrcaddr;
        wanip = _ipdstaddr;
        edit_tcpudpsrcport = src_port;
        edit_tcpudpdstport = dst_port;

    } else //OUT
    {
        //IP
        lanip = _ipdstaddr;
        wanip = _ipsrcaddr;
        edit_tcpudpsrcport = dst_port;
        edit_tcpudpdstport = src_port;
    }


    $("#edit_ipsrcaddr").val(lanip);
    $("#edit_tcpudpsrcport").val(edit_tcpudpsrcport);
    $("#edit_ipdstaddr").val(wanip);
    $("#edit_tcpudpdstport").val(edit_tcpudpdstport);
    $("#edit_ip_type").val('6');

    $('#editLANIP').modal('show');
}

function EditDHCPEntries() {
    var edit_ip_type = $("#edit_ip_type").val();
    var firewallhandle = $("#firewallhandle").val();
    var ipsrcvld, ipdstvld, ipsrcaddr, ipdstaddr, ip6srcvld, ip6dstvld, ip6srcaddr, ip6dstaddr, ipdstsubnet, ip6dstlen, direction, r_tcpudpsrcport, r_tcpudpdstport, r_tcpudpsrcrange, r_tcpudpdstrange, r2_tcpudpsrcport, r2_tcpudpdstport, r2_tcpudpsrcrange, r2_tcpudpdstrange;
    var tcpudpsrcvld, tcpudpdstvld;
    var ipversion = $("#edit_ipversion").val();
    var nxthdrproto = $("#edit_nxthdrproto").val();
    var config_state = $("#OLD_Firewall_enable").val();
    var config_pkts = $("#OLD_pkts_allowed").val();
    var direction = $("#edit_direction").val();
    var _ipsrcaddr = $("#edit_ipsrcaddr").val();
    var _ipdstaddr = $("#edit_ipdstaddr").val();
    var obj_check;


    if (ipversion == 4) {
        ipsrcvld = 1;
        ipdstvld = 1;
        ipsrcaddr = $("#edit_ipsrcaddr").val();
        ipdstaddr = $("#edit_ipdstaddr").val();
        ip6srcvld = 0;
        ip6dstvld = 0;
        ip6srcaddr = 0;
        ip6dstaddr = 0;
        ipdstsubnet = $("#edit_ipsrcaddr").val();
        ip6dstlen = 0;
        ip6srclen = 0;

    } else if (ipversion == 6) {
        ipsrcvld = 0;
        ipdstvld = 0;
        ipsrcaddr = 0;
        ipdstaddr = 0;
        ip6srcvld = 1;
        ip6dstvld = 1;
        ip6srcaddr = $("#edit_ipsrcaddr").val();
        ip6dstaddr = $("#edit_ipdstaddr").val();
        ipdstsubnet = 0;
        ip6dstlen = 128;
        ip6srclen = 128;
    }

    var tcpudpsrcport = $("#edit_tcpudpsrcport").val();
    var tcpudpdstport = $("#edit_tcpudpdstport").val();

    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = editIPEntries_check(ipversion, nxthdrproto);

    if (flag) {

        // Get Firewall for checking relu conflicted 
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetFirewall",
                IP_Type: ipversion,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }

                obj_check = obj;

                // Ex.
                // WAN IP:Port 10.57.1.2:80
                // LAN IP:Port 192.168.225.10:8080

                // In Upload (OUT):
                // Source is 192.168.225.10:8080
                // Destination is 10.57.1.2:80

                // In Download (IN):
                // Source is 10.57.1.2:80
                // Destination is 192.168.225.10:8080

                var o_tcpudpsrcport = $("#edit_tcpudpsrcport").val();
                var o_tcpudpdstport = $("#edit_tcpudpdstport").val();
                var port_any_flag = checkPortIsAny('edit_tcpudpsrcport');
                var port_range_flag = checkPortIsRange('edit_tcpudpsrcport');
                if (port_any_flag) {
                    r_tcpudpsrcport = 1;
                    r_tcpudpsrcrange = 65534;
                } else if (port_range_flag) {
                    var temp = o_tcpudpsrcport.split("-");
                    var str_0 = parseInt(temp[0]);
                    var str_1 = parseInt(temp[1]);
                    r_tcpudpsrcport = str_0;
                    r_tcpudpsrcrange = str_1 - str_0;
                } else {
                    r_tcpudpsrcport = $("#edit_tcpudpsrcport").val();
                    r_tcpudpsrcrange = 0;
                }
                //=======
                var port_any_flag2 = checkPortIsAny('edit_tcpudpdstport');
                var port_range_flag2 = checkPortIsRange('edit_tcpudpdstport');
                if (port_any_flag2) {
                    r2_tcpudpdstport = 1;
                    r2_tcpudpdstrange = 65534;
                } else if (port_range_flag2) {
                    var temp2 = o_tcpudpdstport.split("-");
                    var str2_0 = parseInt(temp2[0]);
                    var str2_1 = parseInt(temp2[1]);
                    r2_tcpudpdstport = str2_0;
                    r2_tcpudpdstrange = str2_1 - str2_0;
                } else {
                    r2_tcpudpdstport = $("#edit_tcpudpdstport").val();
                    r2_tcpudpdstrange = 0;
                }
                if (ipversion == 4) {
                    var Netmask = ValidateIPV4andReturnValue("edit_ipsrcaddr");
                    if (Netmask) {
                        var _ipsrcaddrArray = _ipsrcaddr.split("/");
                        _ipsrcaddr = _ipsrcaddrArray[0];                        
                    } else {
                        Netmask = 0;
                    }
                    var Netmask2 = ValidateIPV4andReturnValueWAN("edit_ipdstaddr");
                    if (Netmask2) {
                        var _ipdstaddrArray = _ipdstaddr.split("/");
                        _ipdstaddr = _ipdstaddrArray[0];
                        //_ipdstaddr = _ipdstaddr.substring(0, _ipdstaddr.length - 3);
                    } else {
                        Netmask2 = 0;
                    }  
                } else {
                    var Netmask_6 = ValidateIPV6andReturnValue("edit_ipsrcaddr");
                    if (Netmask_6>=0) {
                        var _temp = _ipsrcaddr.split("/");
                        _ipsrcaddr = _temp[0];
                    } else {
                        Netmask_6 = 128;
                    }
                    var Netmask2_6 = ValidateIPV6andReturnValue("edit_ipdstaddr");
                    if (Netmask2_6>=0) {
                        var _temp2 = _ipdstaddr.split("/");
                        _ipdstaddr = _temp2[0];
                    } else {
                        Netmask2_6 = 128;
                    }
                }

                if (direction == "1") { //IN
                    if (ipversion == 4) {
                        ipsrcvld = 1;
                        ipdstvld = 1;
                        ipsrcaddr = _ipsrcaddr;
                        ipdstaddr = _ipdstaddr;
                        ip6srcvld = 0;
                        ip6dstvld = 0;
                        ip6srcaddr = 0;
                        ip6dstaddr = 0;
                        tcpudpsrcvld = 1;
                        tcpudpdstvld = 1;
                        //ipdstsubnet = "255.255.255.255";
                        ip6dstlen = 0;
                        ip6srclen = 0;
                        tcpudpsrcport = r_tcpudpsrcport;
                        tcpudpdstport = r2_tcpudpdstport;
                        tcpudpsrcrange = r_tcpudpsrcrange;
                        tcpudpdstrange = r2_tcpudpdstrange;
                        ipsrcsubnet = Netmask ? Netmask : "255.255.255.255";
                        ipdstsubnet = Netmask2 ? Netmask2 : "255.255.255.255";
                        //var IPV4_SRC_VALID = ValidateIPV4("ipsrcaddr");
                    } else if (ipversion == 6) {
                        ipsrcvld = 0;
                        ipdstvld = 0;
                        ipsrcaddr = 0;
                        ipdstaddr = 0;
                        ip6srcvld = 1;
                        ip6dstvld = 1;
                        ip6srcaddr = _ipsrcaddr; //
                        ip6dstaddr = _ipdstaddr; //
                        tcpudpsrcvld = 1;
                        tcpudpdstvld = 1;
                        //ipdstsubnet = 0;
                        ip6dstlen = (Netmask2_6>=0) ? Netmask2_6 : 128;
                        ip6srclen = (Netmask_6>=0) ? Netmask_6 : 128;
                        tcpudpsrcport = r_tcpudpsrcport;
                        tcpudpdstport = r2_tcpudpdstport;
                        tcpudpsrcrange = r_tcpudpsrcrange;
                        tcpudpdstrange = r2_tcpudpdstrange;
                        ipsrcsubnet = 0;
                        ipdstsubnet = 0;
                    }
                } else { // OUT
                    if (ipversion == 4) {
                        ipsrcvld = 1;
                        ipdstvld = 1;
                        ipsrcaddr = _ipdstaddr;
                        ipdstaddr = _ipsrcaddr;
                        ip6srcvld = 0;
                        ip6dstvld = 0;
                        ip6srcaddr = 0;
                        ip6dstaddr = 0;
                        tcpudpsrcvld = 1;
                        tcpudpdstvld = 1;
                        //ipdstsubnet = "255.255.255.255";
                        ip6dstlen = 0;
                        ip6srclen = 0;
                        tcpudpsrcport = r2_tcpudpdstport;
                        tcpudpdstport = r_tcpudpsrcport;
                        tcpudpsrcrange = r2_tcpudpdstrange;
                        tcpudpdstrange = r_tcpudpsrcrange;
                        //var IPV4_SRC_VALID = ValidateIPV4("ipsrcaddr");
                        ipsrcsubnet = Netmask2 ? Netmask2 : "255.255.255.255";
                        ipdstsubnet = Netmask ? Netmask : "255.255.255.255";
                    } else if (ipversion == 6) {
                        ipsrcvld = 0;
                        ipdstvld = 0;
                        ipsrcaddr = 0;
                        ipdstaddr = 0;
                        ip6srcvld = 1;
                        ip6dstvld = 1;
                        ip6srcaddr = _ipdstaddr;
                        ip6dstaddr = _ipsrcaddr;
                        tcpudpsrcvld = 1;
                        tcpudpdstvld = 1;
                        //ipdstsubnet = 0;
                        ip6dstlen = (Netmask_6>=0) ? Netmask_6 : 128;
                        ip6srclen = (Netmask2_6>=0) ? Netmask2_6 : 128;
                        tcpudpsrcport = r2_tcpudpdstport;
                        tcpudpdstport = r_tcpudpsrcport;
                        tcpudpsrcrange = r2_tcpudpdstrange;
                        tcpudpdstrange = r_tcpudpsrcrange;
                        ipsrcsubnet = 0;
                        ipdstsubnet = 0;
                        //var IPV6_SRC_VALID = ValidateIPV6("ipsrcaddr");
                    }
                }

                if (nxthdrproto == "1") { //ICMP
                    tcpudpsrcvld = 0;
                    tcpudpdstvld = 0;
                    tcpudpsrcport = 0;
                    tcpudpdstport = 0;
                    if (ipversion == 6) {
                        nxthdrproto = "58";
                    }
                }

                for (i = 0; i < obj_check.count; i++) { // Check rule conflict of port

                    if ( firewallhandle == obj_check.entries[i].handle) continue; // Skip to check with origianl rule

                    if ( direction != obj_check.entries[i].direction ) continue;
                    if ( nxthdrproto != obj_check.entries[i].nxthdrproto ) continue;
                    if ( ipversion == 4 ) {
                        if ( ipsrcaddr != obj_check.entries[i].ipsrcaddr ) continue;
                        if ( ipsrcsubnet != obj_check.entries[i].ipsrcsubnet ) continue;
                        if ( ipdstaddr != obj_check.entries[i].ipdstaddr ) continue;
                        if ( ipdstsubnet != obj_check.entries[i].ipdstsubnet ) continue;
                    }
                    if ( ipversion == 6 ) {
                        if ( ip6srcaddr != obj_check.entries[i].ip6srcaddr ) continue;
                        if ( ip6srclen != obj_check.entries[i].ip6srclen ) continue;
                        if ( ip6dstaddr != obj_check.entries[i].ip6dstaddr ) continue;
                        if ( ip6dstlen != obj_check.entries[i].ip6dstlen ) continue;
                    }

                    var i_tcpudpsrcport = parseInt(tcpudpsrcport);
                    var i_tcpudpdstport = parseInt(tcpudpdstport);
                    var i_tcpudpsrcrange = parseInt(tcpudpsrcrange);
                    var i_tcpudpdstrange = parseInt(tcpudpdstrange);
                    var e_tcpudpsrcport = parseInt(obj_check.entries[i].tcpudpsrcport);
                    var e_tcpudpdstport = parseInt(obj_check.entries[i].tcpudpdstport);
                    var e_tcpudpsrcrange = parseInt(obj_check.entries[i].tcpudpsrcrange);
                    var e_tcpudpdstrange = parseInt(obj_check.entries[i].tcpudpdstrange);

                    if ( i_tcpudpsrcport >= e_tcpudpsrcport && i_tcpudpdstport >= e_tcpudpdstport &&
                        (i_tcpudpsrcport + i_tcpudpsrcrange) <= (e_tcpudpsrcport + e_tcpudpsrcrange) &&
                        (i_tcpudpdstport + i_tcpudpdstrange) <= (e_tcpudpdstport + e_tcpudpdstrange) )
                    {
                        alert($.i18n.prop("lan.settings.IPAddr.Filtering.RuleDupDesc"));
                        return;
                    }
                }

                var form = {
                    Page: "SetFirewall",
                    mask: "3",
                    config_state: config_state,
                    config_pkts: config_pkts,
                    firewallhandle: firewallhandle,
                    ipversion: ipversion,
                    nxthdrprotovld: "1",
                    nxthdrproto: nxthdrproto,
                    tcpudpsrcvld: tcpudpsrcvld,
                    tcpudpsrcport: tcpudpsrcport,
                    tcpudpsrcrange: tcpudpsrcrange,
                    tcpudpdstvld: tcpudpdstvld,
                    tcpudpdstport: tcpudpdstport,
                    tcpudpdstrange: tcpudpdstrange,
                    icmptypvld: "0",
                    icmptyp: "0",
                    icmpcodevld: "0",
                    icmpcode: "0",
                    espspivld: "0",
                    espspi: "0",
                    ipsrcvld: ipsrcvld,
                    ipsrcaddr: ipsrcaddr,
                    ipsrcsubnet: ipsrcsubnet,
                    iptosvld: "0",
                    iptosvlv: "0",
                    iptosmsk: "0",
                    ip6srcvld: ip6srcvld,
                    ip6srcaddr: ip6srcaddr,
                    ip6srclen: ip6srclen,
                    ip6trsclfvld: "0",
                    ip6trsclfvlv: "0",
                    ip6trsclfmsk: "0",
                    ipdstvld: ipdstvld,
                    ipdstaddr: ipdstaddr,
                    ipdstsubnet: ipdstsubnet,
                    ip6dstvld: ip6dstvld,
                    ip6dstaddr: ip6dstaddr,
                    ip6dstlen: ip6dstlen,
                    direction: direction,
                    token: session_token
                };

                var flag2;
                flag2 = true;
                if (flag2) {
                    ipsrcaddr = ipsrcaddr.toString().trim();
                    ipdstaddr = ipdstaddr.toString().trim();   
                    ip6srcaddr = ip6srcaddr.toString().trim();
                    ip6dstaddr = ip6dstaddr.toString().trim();

                    $.LoadingOverlay("show");
                    $.ajax({
                        type: "POST",
                        url: "../../cgi-bin/qcmap_web_cgi",
                        data: {
                            Page: "SetFirewall",
                            mask: "3",
                            config_state: config_state,
                            config_pkts: config_pkts,
                            firewallhandle: firewallhandle,
                            ipversion: ipversion,
                            nxthdrprotovld: "1",
                            nxthdrproto: nxthdrproto,
                            tcpudpsrcvld: tcpudpsrcvld,
                            tcpudpsrcport: tcpudpsrcport,
                            tcpudpsrcrange: tcpudpsrcrange,
                            tcpudpdstvld: tcpudpdstvld,
                            tcpudpdstport: tcpudpdstport,
                            tcpudpdstrange: tcpudpdstrange,
                            icmptypvld: "0",
                            icmptyp: "0",
                            icmpcodevld: "0",
                            icmpcode: "0",
                            espspivld: "0",
                            espspi: "0",
                            ipsrcvld: ipsrcvld,
                            ipsrcaddr: ipsrcaddr,
                            ipsrcsubnet: ipsrcsubnet,
                            iptosvld: "0",
                            iptosvlv: "0",
                            iptosmsk: "0",
                            ip6srcvld: ip6srcvld,
                            ip6srcaddr: ip6srcaddr,
                            ip6srclen: ip6srclen,
                            ip6trsclfvld: "0",
                            ip6trsclfvlv: "0",
                            ip6trsclfmsk: "0",
                            ipdstvld: ipdstvld,
                            ipdstaddr: ipdstaddr,
                            ipdstsubnet: ipdstsubnet,
                            ip6dstvld: ip6dstvld,
                            ip6dstaddr: ip6dstaddr,
                            ip6dstlen: ip6dstlen,
                            direction: direction,
                            token: session_token
                        },
                        dataType: "text",
                        success: function (msgs) {
                            $.LoadingOverlay("hide");
                            var obj = jQuery.parseJSON(msgs);
                            if (obj.result == "AUTH_FAIL") {
                                //clearSession();
                                clearSession();
                                alert($.i18n.prop("error.AUTH_FAIL"));
                                return;
                            }
                            if (obj.result == "Token_mismatch") {
                                clearSession();
                                alert($.i18n.prop("error.Token_mismatch"));
                                return;
                            }
                            if (obj.commit == "Socket Send Error") {
                                clearSession();
                                alert($.i18n.prop("error.SocketSendError"));
                                return;
                            }
                            if (obj.result == "QTApp_Login") {
                                clearSession();
                                alert($.i18n.prop("common.Routerdeviceinuse"));
                                return;
                            }
                            if (obj.result == "SUCCESS") {

                                alert($.i18n.prop("success.message"));
                                location.reload();

                            } else if (obj.result == "NO EFFECT") {
                                alert($.i18n.prop("lan.settings.IPAddr.Filtering.RuleDupDesc"));
                                return;
                            } else {
                                alert($.i18n.prop("error.invalidformat"));
                                return;
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            //$.LoadingOverlay("hide");
                            clearSession();
                            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                        }
                    });
                }
            }
        });
    }
}

function addIPEntries_check(ipversion, nxthdrproto) {
    if (nxthdrproto == "1") {
        if (ipversion == 4) {
            if (!ValidateIPV4("ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpsrcport")) {
            //   return false;
            // }
            else if (!ValidateIPV4WAN("ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpdstport")) {
            //   return false;
            // }
            else {
                return true;
            }
        } else if (ipversion == 6) {
            if (!ValidateIPV6("ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpsrcport")) {
            //   return false;
            // }
            else if (!ValidateIPV6("ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpdstport")) {
            //   return false;
            // }
            else {
                return true;
            }
        }
    } else {
        if (ipversion == 4) {
            if (!ValidateIPV4("ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("tcpudpsrcport", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
                return false;
            } else if (!ValidateIPV4WAN("ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("tcpudpdstport", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
                return false;
            } else {
                return true;
            }
        } else if (ipversion == 6) {
            if (!ValidateIPV6("ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("tcpudpsrcport", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
                return false;
            } else if (!ValidateIPV6("ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("tcpudpdstport", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
                return false;
            } else {
                return true;
            }
        }
    }

}

function editIPEntries_check(ipversion, nxthdrproto) {
    if (nxthdrproto == "1") {
        if (ipversion == 4) {
            if (!ValidateIPV4("edit_ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpsrcport")) {
            //   return false;
            // }
            else if (!ValidateIPV4WAN("edit_ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpdstport")) {
            //   return false;
            // }
            else {
                return true;
            }
        } else if (ipversion == 6) {
            if (!ValidateIPV6("edit_ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpsrcport")) {
            //   return false;
            // }
            else if (!ValidateIPV6("edit_ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            }
            // else if (!ValidateTCPUDPPort("tcpudpdstport")) {
            //   return false;
            // }
            else {
                return true;
            }
        }
    } else {
        if (ipversion == 4) {
            if (!ValidateIPV4("edit_ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("edit_tcpudpsrcport", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
                return false;
            } else if (!ValidateIPV4WAN("edit_ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("edit_tcpudpdstport", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
                return false;
            } else {
                return true;
            }
        } else if (ipversion == 6) {
            if (!ValidateIPV6("edit_ipsrcaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("edit_tcpudpsrcport", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
                return false;
            } else if (!ValidateIPV6("edit_ipdstaddr", $.i18n.prop("lan.settings.IPAddr.Filtering.WANIPAddr"))) {
                return false;
            } else if (!ValidateTCPUDPPort("edit_tcpudpdstport", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
                return false;
            } else {
                return true;
            }
        }
    }
}

function GetUSBSetting() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetUSBSetting",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Get_USB_Result == "SUCCESS") {
                $("#OLD_Tethering").val(obj.Tethering);
                $("#OLD_Mode").val(obj.Mode);
                if (obj.Tethering == "Y") {
                    $('#Select_Tethering').bootstrapToggle('on');
                } else if (obj.Tethering == "N") {
                    $('#Select_Tethering').bootstrapToggle('off');
                    $("#Select_Firewall_enable option[value=0]").prop('selected', true);
                }
                if (obj.Mode == "super") {
                    $("#usbMode option[value=super]").prop('selected', true);
                } else if (obj.Mode == "high") {
                    $("#usbMode option[value=high]").prop('selected', true);
                }

            }
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function ConfirmUSBSetting() {
    $('#confirmUSBMode').modal('show');
}

function SetUSBSetting() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Tethering;
    Tethering = "Y";

    var usbMode = $("#usbMode").val();
    // var OLD_Mode = $("#OLD_Mode").val();
    var form = {
        Page: "SetUSBSetting",
        Flag: 0,
        Tethering: Tethering,
        Mode: usbMode,
        token: session_token
    };
    var flag = true;
    if (flag) {
        var token = session_token;
        clearSessionNoJump();
        // $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetUSBSetting",
                Flag: 0,
                Tethering: Tethering,
                Mode: usbMode,
                token: token
            },
            dataType: "text",
            success: function (msgs) {
                // $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Set_USB_Result == "SUCCESS") {
                    alert($.i18n.prop("success.message"));
                    clearSession();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                clearSession();
            }
        });

    }
}

function doublequoteReplace(str) {
    var return_str = "";
    return_str = str.replace(/\\/g, '\\\\');
    return_str = return_str.replace(/"/g, '\\"');
    return return_str;
}

function GetAllAPN() {
    var card = "";
    var Error_Msg = "";
    var crud = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAllAPN",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Get_All_APN_Result == "SUCCESS") {
                var id, profile, apn, username, password, authtype, iptype, preset, current, iptype_display, authtype_display, checked, IptypeRoaming, IptypeRoaming_display;
                var default_apn_name;
                $("#APN_List").val(JSON.stringify(obj.APN_List));
                $("#APN_Total").val(obj.APN_List.length);

                for (i = 0; i < obj.APN_List.length; i++) {
                    id = obj.APN_List[i].ID;
                    profile = obj.APN_List[i].Profile ? obj.APN_List[i].Profile : '';
                    apn = obj.APN_List[i].Apn ? obj.APN_List[i].Apn : '';
                    username = obj.APN_List[i].Username ? obj.APN_List[i].Username : '';
                    password = obj.APN_List[i].Password ? obj.APN_List[i].Password : '';
                    authtype = obj.APN_List[i].Authtype;
                    iptype = obj.APN_List[i].Iptype;
                    preset = obj.APN_List[i].Preset;
                    current = obj.APN_List[i].Current;
                    IptypeRoaming = obj.APN_List[i].IptypeRoaming;
                    show = obj.APN_List[i].Show;

                    if(show == 1) // 
                    {
                        switch (String(iptype)) {
                            case "0":
                                iptype_display = 'IPv4';
                                break;
                            case "2":
                                iptype_display = 'IPv6';
                                break;
                            case "3":
                                iptype_display = 'IPv4/IPv6';
                                break;
                            default:
                                iptype_display = '';
                                break;
                        }

                        switch (String(authtype)) {
                            case "0":
                                authtype_display = 'None';
                                break;
                            case "1":
                                authtype_display = 'PAP';
                                break;
                            case "2":
                                authtype_display = 'CHAP';
                                break;
                            case "3":
                                authtype_display = 'PAP&CHAP';
                                break;
                            default:
                                authtype_display = '';
                                break;
                        }

                        switch (String(IptypeRoaming)) {
                            case "0":
                                IptypeRoaming_display = 'IPv4';
                                break;
                            case "1":
                                IptypeRoaming_display = 'IPv6';
                                break;
                            case "2":
                                IptypeRoaming_display = 'IPv4/IPv6';
                                break;
                            default:
                                IptypeRoaming_display = '';
                                break;
                        }


                        if (current == 1) {
                            checked = 'checked';
                            $("#current").val(id);
                        } else {
                            checked = '';
                        }

                        if (preset == 1) {
                            crud = '<div class="card-edit-footer">' +
                                '<div class="row text-right mr-1">' +
                                '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                                '</div>' +
                                '</div>' +
                                '</div></div>';
                            apn = '******';
                            username = '******';
                            password = '******';
                            authtype_display = '******';
                            iptype_display = '******';
                            IptypeRoaming_display = '******';
                            if(!default_apn_name)
                            {
                                default_apn_name = obj.APN_List[i].Profile
                                $("#default_apn_name").val(default_apn_name);
                                $("#default_apn_id").val(obj.APN_List[i].ID);
                            } 
                        } else {
                            if (current == 1) 
                            {
                                crud = '<div class="card-edit-footer">' +
                                    '<div class="row text-right mr-1">' +
                                    '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                                    '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmDeleteInUseAPN(\'' + id + '\')" ><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>' +
                                    '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmEditAPN(\'' + i + '\')"><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div></div>';
                                $("#current_apn_name").val(obj.APN_List[i].Profile);
                            }
                            else {
                                crud = '<div class="card-edit-footer">' +
                                    '<div class="row text-right mr-1">' +
                                    '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                                    '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmDeleteAPN(\'' + id + '\')" ><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>' +
                                    '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmEditAPN(\'' + i + '\')"><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div></div>';
                            }
                            // apn = '******';
                            // username = '******';
                            if (password) {
                                password = '******';
                            }
                        }

                        card += '<div class="col-12 col-md-6 col-lg-6 text-center align-self-center">' +
                            '<div class="card-edit-body">' +
                            '<div class="col-12 col-md-12 col-lg-12 text-right mt-1">' +
                            '<div class="form-check">' +
                            '<input class="form-check-input" type="radio" onchange="applyHandle(this.value)" name="apn_radio" value="' + id + '" ' + checked + '>' +
                            '<label class="form-check-label" for="exampleRadios1"></label>' +
                            '</div>' +
                            '</div>' +
                            '<div class=" row col-12" style="margin-left:0px; margin-right:0px; padding-bottom: 10px;">' +
                            '<div class="col-12 col-sm-12 col-md-12 col-lg-4 text-center mt-1">' +
                            '<img class="card-image " alt="image" src="assets/img/5g_content/card_image_network.svg">' +
                            '</div>' +
                            '<div class="text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-start">' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.ProfileName">' + $.i18n.prop("apn.profile.setting.ProfileName") + '</span></small>' +
                            '<dt class="card-empty-font">' + htmlEncode(profile) + '</dt>' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.UserName">' + $.i18n.prop("apn.profile.setting.UserName") + '</span></small>' +
                            '<dt class="card-empty-font">' + htmlEncode(username) + '</dt>' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.AuthenticationMethod">' + $.i18n.prop("apn.profile.setting.AuthenticationMethod") + '</span></small>' +
                            '<dt class="card-empty-font">' + authtype_display + '</dt>' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.IPTypeRoaming">' + $.i18n.prop("apn.profile.setting.IPTypeRoaming") + '</span></small>' +
                            '<dt class="card-empty-font">' + IptypeRoaming_display + '</dt>' +
                            '</div>' +
                            '<div class="text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-start">' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.APNName">' + $.i18n.prop("apn.profile.setting.APNName") + '</span></small>' +
                            '<dt class="card-empty-font">' + apn + '</dt>' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.Password">' + $.i18n.prop("apn.profile.setting.Password") + '</span></small>' +
                            '<dt class="card-empty-font">' + password + '</dt>' +
                            '<small style="color:#9EA8B3"><span data-locale="apn.profile.setting.IPType">' + $.i18n.prop("apn.profile.setting.IPType") + '</span></small>' +
                            '<dt class="card-empty-font">' + iptype_display + '</dt>' +
                            '</div>' +
                            '</div>' +
                            '</div>' + crud;
                        }
                }
                if (card != "") {
                    $("#card").html(card);
                }

                //KittyLock
                findKittyKey('ApnProfilesSettings_Apply', 'ApnProfilesSettings_Apply');
                findKittyKey('ApnProfilesSettings_New', 'ApnProfilesSettings_New');
                findKittyKeyClass('ApnProfilesSettings_Apply', 'kitty_lock');
                findAPNKittyKeySlectable('ApnProfilesSettings_Apply');
                //findAPNKittyKeySlectable('ApnProfilesSettings_New');                
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function ConfirmDeleteAPN(id) {
    $("#APNID").val(id);
    $('#deleteAPN').modal('show');
}

function ConfirmDeleteInUseAPN(id) {
    $("#APNID").val(id);
    var default_apn_name = $("#default_apn_name").val();
    var current_apn_name = $("#current_apn_name").val();
    $(".current_profile_name").text(current_apn_name);
    $("#default_profile_name").text(default_apn_name);
    $('#deleteInUseAPN').modal('show');
}

function DeleteAPN() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var APNID = $("#APNID").val();
    var Error_Msg = "";
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AlterAPN",
            Delete: 1,
            ID: APNID,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Alter_APN_Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                clearSession();
                alert(obj.result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function DeleteAndApplyAPN() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var APNID = $("#APNID").val();
    var Error_Msg = "";
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AlterAPN",
            Delete: 1,
            ID: APNID,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            //$.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Alter_APN_Result == "SUCCESS") {

                //Apply Default APN
                ApplyAPNbyDefault();
            } else {
                clearSession();
                alert(obj.result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function ApplyAPN() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var APNID = $("input[name*=apn_radio]:checked").val();
    var Error_Msg = "";
    $.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AlterAPN",
            Delete: 0,
            ID: APNID,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Alter_APN_Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                clearSession();
                alert(obj.Alter_APN_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function ApplyAPNbyDefault() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var APNID = $("#default_apn_id").val();
    var Error_Msg = "";
    //$.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AlterAPN",
            Delete: 0,
            ID: APNID,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Alter_APN_Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                clearSession();
                alert(obj.Alter_APN_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function addAPN() {
    var profile = $("#profile").val();
    var apn = $("#apn").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var authtype = $("#authtype").val();
    var iptype = $("#iptype").val();
    var IpRoaming = $("#IpRoaming").val();

    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = addAPN_check();
    //var flag = true;
    var form = {
        Page: "ModifyAPN",
        Create: "1",
        Profile: profile,
        Apn: apn,
        Username: username,
        Password: password,
        Authtype: authtype,
        Iptype: iptype,
        IpRoaming: IpRoaming,
        token: session_token
    };
    //flag= false;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "ModifyAPN",
                Create: "1",
                ID: "",
                Profile: profile,
                Apn: apn,
                Username: username,
                Password: password,
                Authtype: authtype,
                Iptype: iptype,
                IpRoaming: IpRoaming,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Modify_APN_Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }

}

function addAPNConfirm() {
    var APN_Total = $("#APN_Total").val() ? $("#APN_Total").val() : 0;
    if (APN_Total >= 10) {
        alert($.i18n.prop("apn.profile.setting.maxnumber"));
        return false;
    }
    else {
        $("#addAPN").modal("show");
    }
}

function addAPN_check() {

    if (!checkNameStringType4("profile", 1, 32, $.i18n.prop("apn.profile.setting.ProfileName"))) {
        return false;
    } else if (!checkNameStringType2("apn", 1, 62, $.i18n.prop("apn.profile.setting.APNName"))) {
        return false;
    } else if (!checkNameStringType5("username", 1, 64, $.i18n.prop("apn.profile.setting.UserName"))) {
        return false;
    } else if (!checkNameStringType6("password", 1, 32, $.i18n.prop("apn.profile.setting.Password"))) {
        return false;
    } else {
        return true;
    }

}

function editAPN_check() {

    if (!checkNameStringType4("edit_profile", 1, 32, $.i18n.prop("apn.profile.setting.ProfileName"))) {
        return false;
    } else if (!checkNameStringType2("edit_apn", 1, 62, $.i18n.prop("apn.profile.setting.APNName"))) {
        return false;
    } else if (!checkNameStringType5("edit_username", 1, 64, $.i18n.prop("apn.profile.setting.UserName"))) {
        return false;
    } else if (!checkNameStringType6("edit_password", 1, 32, $.i18n.prop("apn.profile.setting.Password"))) {
        return false;
    } else {
        return true;
    }

}


function ConfirmEditAPN(i) {
    var temp = $("#APN_List").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    $("#APNID").val(entries.ID);
    //var edit_ipversion = entries.ipversion;
    switch (entries.Authtype) {
        case 0:
            $("#edit_authtype option[value=0]").prop('selected', true);
            break;
        case 3:
            $("#edit_authtype option[value=3]").prop('selected', true);
            break;
        case 2:
            $("#edit_authtype option[value=2]").prop('selected', true);
            break;
        case 1:
            $("#edit_authtype option[value=1]").prop('selected', true);
            break;
    }

    switch (entries.Iptype) {
        case 0:
            $("#edit_iptype option[value=0]").prop('selected', true);
            break;
        case 1:
            $("#edit_iptype option[value=1]").prop('selected', true);
            break;
        case 2:
            $("#edit_iptype option[value=2]").prop('selected', true);
            break;
        case 3:
            $("#edit_iptype option[value=3]").prop('selected', true);
            break;
    }
    switch (String(entries.IptypeRoaming)) {
        case "0":
            $("#edit_ipRoaming option[value='0']").prop('selected', true);
            break;
        case "1":
            $("#edit_ipRoaming option[value='1']").prop('selected', true);
            break;
        case "2":
            $("#edit_ipRoaming option[value='2']").prop('selected', true);
            break;
    }


    $("#edit_profile").val(entries.Profile);
    $("#edit_apn").val(entries.Apn);
    $("#edit_username").val(entries.Username);
    $("#edit_password").val(entries.Password);

    $('#editAPN').modal('show');
}


function EditAPN() {
    var profile = $("#edit_profile").val();
    var apn = $("#edit_apn").val();
    var username = $("#edit_username").val();
    var password = $("#edit_password").val();
    var authtype = $("#edit_authtype").val();
    var iptype = $("#edit_iptype").val();
    var IpRoaming = $("#edit_ipRoaming").val();
    var APNID = $("#APNID").val();

    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = editAPN_check();
    //var flag = true;
    var form = {
        Page: "ModifyAPN",
        Create: "0",
        ID: APNID,
        Profile: profile,
        Apn: apn,
        Username: username,
        Password: password,
        Authtype: authtype,
        Iptype: iptype,
        IpRoaming: IpRoaming,
        token: session_token
    };
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "ModifyAPN",
                Create: "0",
                ID: APNID,
                Profile: profile,
                Apn: apn,
                Username: username,
                Password: password,
                Authtype: authtype,
                Iptype: iptype,
                IpRoaming: IpRoaming,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Modify_APN_Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function applyHandle(id) {
    if (id == $("#current").val()) {
        $('#apply').prop("disabled", true);
    } else {
        $('#apply').prop("disabled", false);
    }
}

function GetSnatEntries() {
    var card = "";
    var Error_Msg = "";
    var crud = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetSnatEntries",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                //clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                //clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                //clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.snat_error == "SUCCESS") {
                var private_ip, private_port, global_port, proto, name, proto_display, global_ip_prefix, global_ip_end, global_port_end, private_port_end;
                $("#Port_List").val(JSON.stringify(obj.entries));

                for (i = 0; i < obj.snat_count; i++) {
                    private_ip = obj.entries[i].private_ip;
                    private_port = obj.entries[i].private_port;
                    global_port = obj.entries[i].global_port;
                    global_ip = obj.entries[i].global_ip;
                    global_ip_prefix = obj.entries[i].global_ip_prefix;
                    global_ip_end = obj.entries[i].global_ip_end;
                    global_port_end = obj.entries[i].global_port_end;
                    private_port_end = obj.entries[i].private_port_end;
                    if (global_ip == "0.0.0.0") {
                        global_ip = "";
                    } else if(global_ip_prefix !='32') {
                        global_ip += "/"+global_ip_prefix
                    } else if(global_ip_end != '0.0.0.0') {
                        global_ip += "-"+global_ip_end
                    }
                    // if(global_port=="1" && global_port_end=="65535") {
                    //     global_port = "*";
                    // }else 
                    if(global_port_end>0 && global_port_end != global_port) {
                        global_port += "-"+global_port_end;
                    }

                    // if(private_port=="1" && private_port_end=="65535") {
                    //     private_port = "*";
                    // }else 
                    if(private_port_end>0 && private_port != private_port_end) {
                        private_port += "-"+private_port_end;
                    }
                    proto = obj.entries[i].proto;
                    name = obj.entries[i].name;

                    switch (proto) {
                        case "6":
                            proto_display = 'TCP';
                            break;
                        case "17":
                            proto_display = 'UDP';
                            break;
                        case "253":
                            proto_display = 'TCP/UDP';
                            break;
                        default:
                            proto_display = '';
                            break;
                    }

                    card += '<div class="col-12 col-md-6 col-lg-6 text-center align-self-center">' +
                        '<div class="card-edit-body">' +
                        '<div class=" row col-12" style="margin-left:0px; margin-right:0px; padding-top:10px; padding-bottom: 10px;">' +
                        '<div class="col-12 col-sm-12 col-md-12 col-lg-4 text-center mt-1">' +
                        '<img class="card-image " alt="image" src="assets/img/5g_content/card_image_network.svg">' +
                        '</div>' +
                        '<div class="text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-start">' +
                        '<small class="card-title-font"><span data-locale="lan.port.mapping.RuleName">' + $.i18n.prop("lan.port.mapping.RuleName") + '</span></small>' +
                        '<dt class="card-empty-font">' + name + '</dt>' +
                        '<small class="card-title-font" ><span data-locale="lan.port.mapping.SourceIP">' + $.i18n.prop("lan.port.mapping.SourceIP") + '</span></small>' +
                        '<dt class="card-empty-font">' + global_ip + '</dt>' +
                        '<small class="card-title-font" ><span data-locale="lan.settings.IPAddr.Filtering.LANIPAddr">' + $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr") + '</span></small>' +
                        '<dt class="card-empty-font">' + private_ip + '</dt>' +
                        '<small class="card-title-font" ><span data-locale="lan.settings.IPAddr.Filtering.Protocol">' + $.i18n.prop("lan.settings.IPAddr.Filtering.Protocol") + '</span></small>' +
                        '<dt class="card-empty-font">' + proto_display + '</dt>' +
                        '</div>' +
                        '<div class="text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-start">' +
                        '<dt class="card-empty-font"></dt>' +
                        '<dt class="card-empty-font"></dt>' +
                        '<small class="card-title-font" ><span data-locale="lan.settings.IPAddr.Filtering.WANPort">' + $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort") + '</span></small>' +
                        '<dt class="card-empty-font">' + global_port + '</dt>' +
                        '<small class="card-title-font" ><span data-locale="lan.settings.IPAddr.Filtering.LANPort">' + $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort") + '</span></small>' +
                        '<dt class="card-empty-font">' + private_port + '</dt>' +
                        '<dt class="card-empty-font"></dt>'+
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-edit-footer">' +
                        '<div class="row text-right mr-1">' +
                        '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                        '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmDeletePort(\'' + i + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>' +
                        '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmEditPort(\'' + i + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                        '</div>' +
                        '</div>' +
                        '</div></div>';
                }
                if (card != "") {
                    $("#card").html(card);
                }

                $("#snat_count").val(obj.snat_count);
                //KittyLock
                findKittyKey('PortMapping', 'AddPortMapping');
                findKittyKey('PortMapping', 'EditortMapping');
                findKittyKey('PortMapping', 'DeletePortMapping');

                findKittyKeyClass('PortMapping', 'kitty_lock');     
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function addPortCheck() {
    var snat_count = $("#snat_count").val();
    if(snat_count>=20)
    {
        alert($.i18n.prop("error.addportmappingmore20"));
    }else {
        $("#addPort").modal("show");
    }
}

function addPort() {
    var name = $("#name").val();
    var proto = $("#proto").val();
    var prt_port = $("#prt_port").val();
    var ip = $("#ip").val();
    var gbl_port = $("#gbl_port").val();
    var gbl_ip = $("#gbl_ip").val() ? $("#gbl_ip").val() : "0.0.0.0";
    ip = ip.toString().trim();
    gbl_ip = gbl_ip.toString().trim();
    var gbl_ip_end = "0.0.0.0";
    var gbl_prefix = "32";

    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = addPort_check();
    //flag = true;
    if (flag) {
        //check number 
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetSnatEntries",
                mask: "0",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.snat_error == "SUCCESS") {
                    var snat_count = parseInt(obj.snat_count);
                    if(snat_count>=20)
                    {
                        alert($.i18n.prop("error.addportmappingmore20"));
                    }
                    else
                    {
                        $.LoadingOverlay("show");

                        var checkPrtPortAny = checkPortIsAny('prt_port');
                        var checkPrtPortRange = checkPortIsRange('prt_port');
                        var prt_port_start, prt_port_end;
                        if(checkPrtPortAny) {
                            prt_port_start = 1;
                            prt_port_end = 65535; 
                        }else if(checkPrtPortRange) {
                            var tempPrt = $("#prt_port").val().split("-");
                            prt_port_start = parseInt(tempPrt[0]);
                            prt_port_end = parseInt(tempPrt[1]);    
                        }else {
                            prt_port_start = $("#prt_port").val();
                            // prt_port_end = 0;
                            prt_port_end = $("#prt_port").val();
                        }


                        var checkPortAny = checkPortIsAny('gbl_port');
                        var checkPortRange = checkPortIsRange('gbl_port');
                        var gbl_port_start, gbl_port_end;
                        if(checkPortAny) {
                            gbl_port_start = 1;
                            gbl_port_end = 65535; 
                        }else if(checkPortRange) {
                            var temp = $("#gbl_port").val().split("-");
                            gbl_port_start = parseInt(temp[0]);
                            gbl_port_end = parseInt(temp[1]);    
                        }else {
                            gbl_port_start = $("#gbl_port").val();
                            // gbl_port_end = 0;
                            gbl_port_end = $("#gbl_port").val();
                        }                       
                        var gbl_tokens = gbl_ip.split(".");
                        if(gbl_ip == "0.0.0.0") {
                            gbl_prefix = 0;
                        }else {
                            var gbl_prefix = confirmEnding(gbl_tokens[3]);
                            if(gbl_prefix) {
                                var temp_gbl_ip = gbl_ip.split("/");
                                gbl_ip = temp_gbl_ip[0]
                            }

                            var checkRangeCharacter = gbl_ip.includes("-");
                            if(checkRangeCharacter) {
                                // 譛詠ange character
                                var tokensRange = gbl_ip.split("-");
                                gbl_ip = tokensRange[0];
                                gbl_ip_end = tokensRange[1];
                                gbl_prefix = 32
                            }
                        }
                        var data= {
                            Page: "AddSnatEntry",
                            mask: "0",
                            type: 1,
                            ip: ip,
                            prt_port: prt_port_start,
                            prt_port_end: prt_port_end,
                            gbl_ip: gbl_ip,
                            gbl_prefix: gbl_prefix,
                            gbl_ip_end: gbl_ip_end,
                            gbl_port: gbl_port_start,
                            gbl_port_end: gbl_port_end,
                            proto: proto,
                            name: name,
                            token: session_token
                        }
                        console.log(JSON.stringify(data))


                        $.ajax({
                            type: "POST",
                            url: "../../cgi-bin/qcmap_web_cgi",
                            data: {
                                Page: "AddSnatEntry",
                                mask: "0",
                                type: 1,
                                ip: ip,
                                prt_port: prt_port_start,
                                prt_port_end: prt_port_end,
                                gbl_ip: gbl_ip,
                                gbl_prefix: gbl_prefix,
                                gbl_ip_end: gbl_ip_end,
                                gbl_port: gbl_port_start,
                                gbl_port_end: gbl_port_end,
                                proto: proto,
                                name: name,
                                token: session_token
                            },
                            dataType: "text",
                            success: function (msgs) {
                                $.LoadingOverlay("hide");
                                var obj = jQuery.parseJSON(msgs);
                                if (obj.result == "AUTH_FAIL") {
                                    //clearSession();
                                    clearSession();
                                    alert($.i18n.prop("error.AUTH_FAIL"));
                                    return;
                                }
                                if (obj.result == "Token_mismatch") {
                                    clearSession();
                                    alert($.i18n.prop("error.Token_mismatch"));
                                    return;
                                }
                                if (obj.commit == "Socket Send Error") {
                                    clearSession();
                                    alert($.i18n.prop("error.SocketSendError"));
                                    return;
                                }
                                if (obj.result == "QTApp_Login") {
                                    clearSession();
                                    alert($.i18n.prop("common.Routerdeviceinuse"));
                                    return;
                                }
                                if (obj.Result == "NO EFFECT") {
                                    //clearSession();
                                    alert($.i18n.prop("lan.settings.IPAddr.Filtering.RuleDupDesc"));
                                    return;
                                }
                                if (obj.Result == "INVALID SESSION TYPE") {
                                    //clearSession();
                                    alert($.i18n.prop("lan.port.mapping.DuplicatedProtocolAlert"));
                                    return;
                                }
                                if (obj.Result == "INFO UNAVAILABLE") {
                                    //clearSession();
                                    alert($.i18n.prop("lan.port.mapping.DuplicatedProtocolAlert"));
                                    return;
                                }          
                                if (obj.Result == "OP PARTIAL FAILURE") {
                                    //clearSession();
                                    alert($.i18n.prop("lan.port.mapping.OPPARTIALFAILURE"));
                                    return;
                                }                                                         
                                if (obj.Result == "SUCCESS") {
                
                                    alert($.i18n.prop("success.message"));
                                    location.reload();
                
                                }
                
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                //$.LoadingOverlay("hide");
                                clearSession();
                                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                            }
                        });
                    }
                }
            }
        });
    }
}

function addPort_check() {
    var gbl_ip = $("#gbl_ip").val();
    if (gbl_ip != "") {
        if (!checkNameStringType3("name", 1, 32, $.i18n.prop("lan.port.mapping.RuleName"))) {
            return false;
        } else if (!ValidateIPV4("gbl_ip", $.i18n.prop("lan.port.mapping.SourceIP"))) {
            return false;
        } else if (!ValidateTCPUDPPort("gbl_port", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
            return false;
        } else if (!ValidateIPaddress($("#ip").val(), $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
            return false;
        } else if (!ValidateTCPUDPPort("prt_port", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
            return false;
        } else {
            return true;
        }
    } else {
        if (!checkNameStringType3("name", 1, 32, $.i18n.prop("lan.port.mapping.RuleName"))) {
            return false;
        }
        // else if (!ValidateIPV4("gbl_ip")) {
        //   return false;
        // }  
        else if (!ValidateTCPUDPPort("gbl_port", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
            return false;
        } else if (!ValidateIPaddress($("#ip").val(), $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
            return false;
        } else if (!ValidateTCPUDPPort("prt_port", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
            return false;
        } else {
            return true;
        }
    }
}

// function ValidateInputLength(id, min, max) {
//     var item = $("#" + id).val();
//     var VALID;

//     if (item.length > 0) {
//         if (item.length < min) {
//             VALID = 0;
//             alert($.i18n.prop("error.stringlength1") + ' ' + min + ' ' + $.i18n.prop("error.stringlength2") + ' ' + max + ' ' + $.i18n.prop("error.stringlength3"))
//             //alert("string is too short, must greater than " + min + " characters");
//             $("#" + id).focus();
//         } else if (item.length > max) {
//             VALID = 0;
//             alert($.i18n.prop("error.stringlength1") + ' ' + min + ' ' + $.i18n.prop("error.stringlength2") + ' ' + max + ' ' + $.i18n.prop("error.stringlength3"))
//             //alert("string is too long, must less than " + max + " characters");
//             $("#" + id).focus();
//         } else {
//             VALID = 1;
//         }
//     } else {
//         VALID = 0;
//         alert($.i18n.prop("error.Field_Empty"));
//         //alert("string is empty");
//         $("#" + id).focus();
//     }
//     return VALID;
// }

// function ValidateInputLengthCanEmpty(id, min, max) {
//     var item = $("#" + id).val();
//     var VALID = 1;

//     if (item.length > 0) {
//         if (item.length < min) {
//             VALID = 0;
//             alert($.i18n.prop("error.stringlength1") + ' ' + min + ' ' + $.i18n.prop("error.stringlength2") + ' ' + max + ' ' + $.i18n.prop("error.stringlength3"))
//             //alert("string is too short, must greater than " + min + " characters");
//             $("#" + id).focus();
//         } else if (item.length > max) {
//             VALID = 0;
//             alert($.i18n.prop("error.stringlength1") + ' ' + min + ' ' + $.i18n.prop("error.stringlength2") + ' ' + max + ' ' + $.i18n.prop("error.stringlength3"))
//             //alert("string is too long, must less than " + max + " characters");
//             $("#" + id).focus();
//         } else {
//             VALID = 1;
//         }
//     }
//     return VALID;
// }

function ValidateInputValue(id, min, max, item_name) {
    var item = $("#" + id).val();
    var VALID;
    var noRe = /^[0-9]+$/;
    var re = noRe.test(item);   
    var noLeadingZero = /^0./;
    var token_zero_check = noLeadingZero.test(item);     
    if (!re || token_zero_check) {
        VALID = 0;
        alert($.i18n.prop("error.notaNumber"))
        //alert("The input value is not a Number.");
        $("#" + id).focus();
    } else {
        if (item < min) {
            VALID = 0;
            //alert(item_name + $.i18n.prop("error.stringvaluebetween1")+ min + $.i18n.prop("error.stringvaluebetween2") + max + $.i18n.prop("error.stringvaluebetween3"))
            alert(item_name + $.i18n.prop("error.stringvaluebetween1") + item_name + $.i18n.prop("error.stringvaluebetween2") + min + $.i18n.prop("error.stringvaluebetween3") + max + $.i18n.prop("error.stringvaluebetween4"))

            //alert($.i18n.prop("error.valuesize1") + ' ' + min + ' ' + $.i18n.prop("error.valuesize2") + ' ' + max + $.i18n.prop("error.valuesize3"))
            //alert("The input value must greater than " + min);
            $("#" + id).focus();
        } else if (item > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringvaluebetween1") + item_name + $.i18n.prop("error.stringvaluebetween2") + min + $.i18n.prop("error.stringvaluebetween3") + max + $.i18n.prop("error.stringvaluebetween4"))
            //alert(item_name + $.i18n.prop("error.stringvaluebetween1")+ min + $.i18n.prop("error.stringvaluebetween2") + max + $.i18n.prop("error.stringvaluebetween3"))
            //alert("The input value must less than " + max);
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    }
    return VALID;
}

function ConfirmDeletePort(i) {
    $("#Port_i").val(i);
    $('#deletePort').modal('show');
}

function DeletePort() {
    var i = $("#Port_i").val();
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var temp = $("#Port_List").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    //$("#APNID").val(entries.ID);
    //var APNID = $("#APNID").val();
    var Error_Msg = "";

    var form = {
        Page: "AddSnatEntry",
        mask: "0",
        type: 2,
        ip: entries.private_ip,
        prt_port: entries.private_port,
        prt_port_end: entries.private_port_end,
        gbl_ip: entries.global_ip,
        gbl_prefix: entries.global_ip_prefix,
        gbl_ip_end: entries.global_ip_end,
        gbl_port: entries.global_port,
        gbl_port_end: entries.global_port_end,
        proto: entries.proto,
        name: entries.name,
        token: session_token
    };

    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AddSnatEntry",
            mask: "0",
            type: 2,
            ip: entries.private_ip,
            prt_port: entries.private_port,
            prt_port_end: entries.private_port_end,
            gbl_ip: entries.global_ip,
            gbl_prefix: entries.global_ip_prefix,
            gbl_ip_end: entries.global_ip_end,
            gbl_port: entries.global_port,
            gbl_port_end: entries.global_port_end,
            proto: entries.proto,
            name: entries.name,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                clearSession();
                alert(obj.result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}



function editPort_check() {

    var edit_gbl_ip = $("#edit_gbl_ip").val();
    if (edit_gbl_ip != "") {
        if (!checkNameStringType3("edit_name", 1, 32 ,$.i18n.prop("lan.port.mapping.RuleName"))) {
            return false;
        } else if (!ValidateIPV4("edit_gbl_ip", $.i18n.prop("lan.port.mapping.SourceIP"))) {
            return false;
        } else if (!ValidateTCPUDPPort("edit_gbl_port", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
            return false;
        } else if (!ValidateIPaddress($("#edit_ip").val(), $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
            return false;
        } else if (!ValidateTCPUDPPort("edit_prt_port", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
            return false;
        } else {
            return true;
        }
    } else {
        if (!checkNameStringType3("edit_name", 1, 32, $.i18n.prop("lan.port.mapping.RuleName"))) {
            return false;
        }
        // else if (!ValidateIPV4("edit_gbl_ip")) {
        //   return false;
        // }        
        else if (!ValidateTCPUDPPort("edit_gbl_port", $.i18n.prop("lan.settings.IPAddr.Filtering.WANPort"))) {
            return false;
        } else if (!ValidateIPaddress($("#edit_ip").val(), $.i18n.prop("lan.settings.IPAddr.Filtering.LANIPAddr"))) {
            return false;
        } else if (!ValidateTCPUDPPort("edit_prt_port", $.i18n.prop("lan.settings.IPAddr.Filtering.LANPort"))) {
            return false;
        } else {
            return true;
        }
    }
}


function ConfirmEditPort(i) {
    var temp = $("#Port_List").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    //$("#APNID").val(entries.ID);
    var private_ip, private_port, global_port, global_ip, proto, name, proto_display, global_ip_prefix, global_ip_end, global_port_end, private_port_end;

    switch (entries.proto) {
        case "6":
            $("#edit_proto option[value=6]").prop('selected', true);
            break;
        case "17":
            $("#edit_proto option[value=17]").prop('selected', true);
            break;
        case "253":
            $("#edit_proto option[value=253]").prop('selected', true);
            break;
    }
    private_ip = entries.private_ip;
    private_port = entries.private_port;
    global_port = entries.global_port;
    global_ip = entries.global_ip;
    global_ip_prefix = entries.global_ip_prefix;
    global_ip_end = entries.global_ip_end;
    global_port_end = entries.global_port_end;
    private_port_end = entries.private_port_end;

    if (global_ip == "0.0.0.0") {
        global_ip = "";
    } else if(global_ip_prefix !='32') {
        global_ip += "/"+global_ip_prefix
    } else if(global_ip_end != '0.0.0.0') {
        global_ip += "-"+global_ip_end
    }
    // if(global_port=="1" && global_port_end=="65535") {
    //     global_port = "*";
    // }else 
    if(global_port_end>0 && global_port_end != global_port) {
        global_port += "-"+global_port_end;
    }

    // if(private_port=="1" && private_port_end=="65535") {
    //     private_port = "*";
    // }else 
    if(private_port_end>0 && private_port_end != private_port) {
        private_port += "-"+private_port_end;
    }

    $("#edit_name").val(entries.name);
    $("#edit_prt_port").val(private_port);
    $("#edit_ip").val(private_ip);
    $("#edit_gbl_port").val(global_port);
    $("#edit_gbl_ip").val(global_ip);

    $("#OLD_global_ip").val(entries.global_ip);
    $("#OLD_global_ip_end").val(entries.global_ip_end);
    $("#OLD_global_ip_prefix").val(entries.global_ip_prefix);
    $("#OLD_global_port").val(entries.global_port);
    $("#OLD_global_port_end").val(entries.global_port_end);
    $("#OLD_name").val(entries.name);
    $("#OLD_private_ip").val(entries.private_ip);
    $("#OLD_private_port").val(entries.private_port);
    $("#OLD_private_port_end").val(entries.private_port_end);
    $("#OLD_proto").val(entries.proto);

    $('#editPort').modal('show');
}


function EditPort() {
    var edit_name = $("#edit_name").val();
    var edit_prt_port = $("#edit_prt_port").val();
    var edit_proto = $("#edit_proto").val();
    var edit_ip = $("#edit_ip").val();
    var edit_gbl_port = $("#edit_gbl_port").val();
    var edit_gbl_ip = $("#edit_gbl_ip").val() ? $("#edit_gbl_ip").val() : "0.0.0.0";
    edit_ip = edit_ip.toString().trim();
    edit_gbl_ip = edit_gbl_ip.toString().trim();

    var edit_gbl_ip_end = "0.0.0.0";
    var edit_gbl_prefix = "32";

    var OLD_global_ip = $("#OLD_global_ip").val();
    var OLD_global_ip_end = $("#OLD_global_ip_end").val();
    var OLD_global_ip_prefix = $("#OLD_global_ip_prefix").val();
    var OLD_global_port = $("#OLD_global_port").val();
    var OLD_global_port_end = $("#OLD_global_port_end").val();
    var OLD_name = $("#OLD_name").val();
    var OLD_private_ip = $("#OLD_private_ip").val();
    var OLD_private_port = $("#OLD_private_port").val();
    var OLD_private_port_end = $("#OLD_private_port_end").val();
    var OLD_proto = $("#OLD_proto").val();


    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = editPort_check();
    //var flag = true;

    if (flag) {

        var checkEditPrtPortAny = checkPortIsAny('edit_prt_port');
        var checkEditPrtPortRange = checkPortIsRange('edit_prt_port');
        var edit_prt_port_start, edit_prt_port_end;
        if(checkEditPrtPortAny) {
            edit_prt_port_start = 1;
            edit_prt_port_end = 65535; 
        }else if(checkEditPrtPortRange) {
            var tempEditPrt = $("#edit_prt_port").val().split("-");
            edit_prt_port_start = parseInt(tempEditPrt[0]);
            edit_prt_port_end = parseInt(tempEditPrt[1]);    
        }else {
            edit_prt_port_start = $("#edit_prt_port").val();
            // edit_prt_port_end = 0;
            edit_prt_port_end = $("#edit_prt_port").val();
        }
        var checkEditPortAny = checkPortIsAny('edit_gbl_port');
        var checkEditPortRange = checkPortIsRange('edit_gbl_port');
        var edit_gbl_port_start, edit_gbl_port_end;
        if(checkEditPortAny) {
            edit_gbl_port_start = 1;
            edit_gbl_port_end = 65535; 
        }else if(checkEditPortRange) {
            var tempEdit = $("#edit_gbl_port").val().split("-");
            edit_gbl_port_start = parseInt(tempEdit[0]);
            edit_gbl_port_end = parseInt(tempEdit[1]);    
        }else {
            edit_gbl_port_start = $("#edit_gbl_port").val();
            // edit_gbl_port_end = 0;
            edit_gbl_port_end = $("#edit_gbl_port").val();
        }                       
        var edit_gbl_tokens = edit_gbl_ip.split(".");
        if(edit_gbl_ip == "0.0.0.0") {
            edit_gbl_prefix = 0;
        }else {
            edit_gbl_prefix = confirmEnding(edit_gbl_tokens[3]);
            if(edit_gbl_prefix) {
                var temp_gbl_ip = edit_gbl_ip.split("/");
                edit_gbl_ip = temp_gbl_ip[0]
            }

            var checkRangeCharacter = edit_gbl_ip.includes("-");
            if(checkRangeCharacter) {
                // 譛詠ange character
                var tokensRange = edit_gbl_ip.split("-");
                edit_gbl_ip = tokensRange[0];
                edit_gbl_ip_end = tokensRange[1];
                edit_gbl_prefix = 32
            }
        }
        //======================================      
        var data= {
            Page: "AddSnatEntry",
            mask: 0,
            type: 3,
            ip_new: edit_ip,
            prt_port_new: edit_prt_port_start,
            prt_port_end_new: edit_prt_port_end,
            gbl_ip_new: edit_gbl_ip,
            gbl_prefix_new: edit_gbl_prefix,
            gbl_ip_end_new: edit_gbl_ip_end,
            gbl_port_new: edit_gbl_port_start,
            gbl_port_end_new: edit_gbl_port_end,
            proto_new: edit_proto,
            name_new: edit_name,
            ip: OLD_private_ip,
            prt_port: OLD_private_port,
            prt_port_end: OLD_private_port_end,
            gbl_ip: OLD_global_ip,
            gbl_prefix: OLD_global_ip_prefix,
            gbl_ip_end: OLD_global_ip_end,
            gbl_port: OLD_global_port,
            gbl_port_end: OLD_global_port_end,
            proto: OLD_proto,
            name: OLD_name,
            token: session_token
        }
        console.log(JSON.stringify(data))



        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "AddSnatEntry",
                mask: 0,
                type: 3,
                ip_new: edit_ip,
                prt_port_new: edit_prt_port_start,
                prt_port_end_new: edit_prt_port_end,
                gbl_ip_new: edit_gbl_ip,
                gbl_prefix_new: edit_gbl_prefix,
                gbl_ip_end_new: edit_gbl_ip_end,
                gbl_port_new: edit_gbl_port_start,
                gbl_port_end_new: edit_gbl_port_end,
                proto_new: edit_proto,
                name_new: edit_name,
                ip: OLD_private_ip,
                prt_port: OLD_private_port,
                prt_port_end: OLD_private_port_end,
                gbl_ip: OLD_global_ip,
                gbl_prefix: OLD_global_ip_prefix,
                gbl_ip_end: OLD_global_ip_end,
                gbl_port: OLD_global_port,
                gbl_port_end: OLD_global_port_end,
                proto: OLD_proto,
                name: OLD_name,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "NO EFFECT") {
                    //clearSession();
                    alert($.i18n.prop("lan.settings.IPAddr.Filtering.RuleDupDesc"));
                    return;
                }
                if (obj.Result == "INVALID SESSION TYPE") {
                    //clearSession();
                    alert($.i18n.prop("lan.port.mapping.DuplicatedProtocolAlert"));
                    return;
                }
                if (obj.Result == "INFO UNAVAILABLE") {
                    //clearSession();
                    alert($.i18n.prop("lan.port.mapping.DuplicatedProtocolAlert"));
                    return;
                }          
                if (obj.Result == "OP PARTIAL FAILURE") {
                    //clearSession();
                    alert($.i18n.prop("lan.port.mapping.OPPARTIALFAILURE"));
                    return;
                }                   
                if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetPortMappingStatus(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetSetSnatStatus",
            mask: 1,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            //if (obj.GetGlobalWifiResult == "SUCCESS") {
                if (obj.Result == "SUCCESS") {
                    $("#OLD_PortMappingStatus").val(obj.status)
                    if (obj.status == "1") {
                        $("#Select_Portmapping_enable option[value=1]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('on');
                    } else if (obj.status == "0") {
                        $("#Select_Portmapping_enable option[value=0]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('off');
                    }                    
                    if (callFunc1) {
                        callFunc1();
                    }  
                    //KittyLock    
                }
              
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}

function SetPortMappingStatus() {
    $.LoadingOverlay("show");
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var OLD_PortMappingStatus = $("#OLD_PortMappingStatus").val();
    if(OLD_PortMappingStatus == $("#Select_Portmapping_enable").val()) {
        alert($.i18n.prop("success.message"));
        location.reload();
    }else {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetSetSnatStatus",
                mask: 2,
                status: $("#Select_Portmapping_enable").val(),
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                //if (obj.GetGlobalWifiResult == "SUCCESS") {
                    if (obj.Result == "SUCCESS") {
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    }
            },
            error: function (xhr, textStatus, errorThrown) {
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }

}


function restore() {

    $("#upload_form").trigger('submit');

}

$('#upload_form').submit(function (e) {
    $("#confirmRestore").modal("hide");
    e.preventDefault();
    var file_data = $("#upload_file").prop('files')[0];
    if (!file_data) {
        alert($.i18n.prop("error.zipnotfound"));       
    } else {
        var filetype = file_data.type;
        var filename = file_data.name;
        var last3 = filename.substr(filename.length - 3);            
        if(last3 != "zip" && last3 !="ZIP")
        {
            alert($.i18n.prop("error.zipformat"));
        }
        else
        {
            var form_data = new FormData();
            form_data.append('file', file_data);
            form_data.append('fname', "restore.zip");
            form_data.append('fpath', "/data/www/");
            form_data.append('remainingSpaceMB', 10);
            $.LoadingOverlay("show");
            $.ajax({
                type: "POST",
                url: "../../cgi-bin/qcmap_web_upload",
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                dataType: "text",
                success: function (msgs) {
                    var obj = jQuery.parseJSON(msgs);

                    switch (obj.Result) {
                        case "SUCCESS":
                            var filepath = 'restore.zip';
                            RestoreConfiguration(filepath);
                            break;
                        case "FILE_NOTFOUND_FAIL":
                            $.LoadingOverlay("hide");
                            alert($.i18n.prop("error.zipnotfound"));
                            //alert('zip files are not found')
                            break;
                        case "FILE_PATH_FAIL":
                            $.LoadingOverlay("hide");
                            alert($.i18n.prop("error.zipnotfound"));
                            //alert('zip files path are not found')
                            break;
                        case "FILE_FORMAT_FAIL":
                            $.LoadingOverlay("hide");
                            alert($.i18n.prop("error.zipformat"));
                            //alert('zip files are only allowed')
                            break;
                        case "FILE_SIZE_FAIL":
                            $.LoadingOverlay("hide");
                            alert($.i18n.prop("error.filesize"));
                            break;
                        case "FILE_OPEN_FILE_FAIL":
                            $.LoadingOverlay("hide");
                            alert($.i18n.prop("error.zipnotfound"));
                            break;
                        default:
                            $.LoadingOverlay("hide");
                            alert($.i18n.prop("error.zipnotfound"));
                            break;
                    }
                }
            })
        }
    }
});

function ConfirmManualSearch() {
    //$("#Port_i").val(i);
    $('#confirmManualSearch').modal('show');
}

function SearchNetwork() {

    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAvailableNetwork",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Available_Network_Result == "SUCCESS" && obj.Amount > 0) {

                var select_top, select_end, key, forbidden;
                var option = '';
                select_top = 
                    '<div calss="col-12 col-md-3"' +
                    'style="height:100px;overflow:auto; background:#fdfdff; border:1px #e4e7fc solid;border-radius:4px;">' +
                    '<ul>';

                for (i = 0; i < obj.Amount; i++) {
                    forbidden = "";
                    if(obj.Network[i].FORBID == 1)
                    {
                        forbidden = " <span data-locale='network.forbidden'>"+ $.i18n.prop("network.forbidden") +"</span>"
                    }
                    key = obj.Network[i].MCC + '|' + obj.Network[i].MNC + '|' + obj.Network[i].Operator + '|' + obj.Network[i].MNCPCS;
                    option += '<div class="form-check">' +
                        '<input class="form-check-input" type="radio" name="network_new" id="' + key + '" value="' + key + '" >' +
                        '<label class="form-check-label" for="' + key + '"> ' + obj.Network[i].Operator + forbidden + ' </label>' +
                        '</div>';
                }
                select_end = '</ul></div>';

                $("#current_network_section").hide();
                $("#search_network_section").html(select_top + option + select_end);
                $("#search_network_section").show();
                $("#SelectAvailableNetwork").show();
                $("#CurrentNetwork").hide();
                $("#SetApply").hide();
                $("#ManualApply").show();
                $('#confirmManualSearch').modal('hide');

            } else {
                $('#confirmManualSearch').modal('hide');
                //$('#againManualSearch').modal('hide');                  
                $('#againManualSearch').modal('show');
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}


function GetAutoRebootConfig() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    //$.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAutoRebootConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                switch (String(obj.Auto_Reboot)) {
                    case "1":
                        $("#Select_Auto_reboot option[value=1]").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_Auto_reboot option[value=0]").prop('selected', true);
                        break;
                }
                // if (obj.Auto_Reboot == "1") {
                //   $('#Select_Auto_reboot').bootstrapToggle('on');
                // } else if (obj.Auto_Reboot == "0") {
                //   $('#Select_Auto_reboot').bootstrapToggle('off');
                // }

                //KittyLock
                findKittyKey('Reboot_AutomaticReboot', 'Select_Auto_reboot');
                findKittyKey('Reboot_AutomaticRebootTime_Days', 'interval');
                findKittyKey('Reboot_AutomaticRebootTime_Time', 'time_minute');
                findKittyKey('Reboot_AutomaticRebootTime_Time', 'time_hour');

                obj.Hour = ('0'+ obj.Hour).slice(-2);
                obj.Minute = ('0'+ obj.Minute).slice(-2);
                $("#interval").val(obj.Interval);
                $("#time_hour").val(obj.Hour);
                $("#time_minute").val(obj.Minute);
                //$.LoadingOverlay("hide");
            } else {
                alert(obj.GetGlobalWifiResult);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetAutoRebootConfig() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var Auto_Reboot, Interval, Hour, Minute;

    Interval = $("#interval").val();
    Hour = $("#time_hour").val();
    Minute = $("#time_minute").val();
    //$.LoadingOverlay("show");

    Auto_Reboot = $("#Select_Auto_reboot").val();
    // if ($("#Select_Auto_reboot").prop('checked')) {
    //   Auto_Reboot = 1;
    // } else {
    //   Auto_Reboot = 0;
    // }

    var flag = reboot_check();
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetAutoRebootConfig",
                Auto_Reboot: Auto_Reboot,
                Interval: Interval,
                Hour: Hour,
                Minute: Minute,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function RebootDevice() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var flag = true;

    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "RebootDevice",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    //clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    //clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    //clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {                   
                    SessionIdleInterval = self.setInterval("sessionCheckToServer()", 5000); // 5 seconds check again
                    //alert($.i18n.prop("success.message"));
                    //clearSession();
                    //location.reload();

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function ConfirmEditConnectedType(list, i) {
    var temp = $("#" + list).val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    if (entries.connected_name != '') {
        $("#edit_hostname").val(entries.connected_name);
    } else {
        $("#edit_hostname").val(entries.dev_name);
    }

    $("#Mac_Addr").val(entries.mac_addr);

    switch (entries.connected_icon) {
        case "phone":
            $("input[name*='edit_type'][value='phone']").prop("checked", true);
            break;
        case "tablet":
            $("input[name*='edit_type'][value='tablet']").prop("checked", true);
            break;
        case "pc":
            $("input[name*='edit_type'][value='pc']").prop("checked", true);
            break;
        case "others":
            $("input[name*='edit_type'][value='others']").prop("checked", true);
            break;
        default:
            $("input[name*='edit_type'][value='others']").prop("checked", true);
            break;
    }

    $('#editConnectedType').modal('show');
}

function ConfirmReboot() {
    $('#confirmReboot').modal('show');
}

function ConfirmReset() {
    $('#confirmReset').modal('show');
}

function ConfirmUpnp() {
    $('#confirmUpnp').modal('show');
}

function reboot_check() {

    if (!ValidateRebootDaysInputValue("interval", 1, 30)) {
        return false;
    } else if (!ValidateRebootTimeInputValue("time_hour", 0, 23)) {
        return false;
    } else if (!ValidateRebootTimeInputValue("time_minute", 0, 59)) {
        return false;
    } else {
        return true;
    }

}

function ValidateRebootDaysInputValue(id, min, max) {
    var item = $("#" + id).val();
    var VALID;

    if (item != parseInt(item, 10) || item == "" || (item.toString().indexOf('.') != -1)) {  
        VALID = 0;
        alert($.i18n.prop("error.notaNumber"))
        //alert("The input value is not a Number.");
        $("#" + id).focus();
    } else {
        if (item < min) {
            VALID = 0;
            alert($.i18n.prop("setting.reboot.RebootDayInvalid"))
            //alert("The input value must greater than " + min);
            $("#" + id).focus();
        } else if (item > max) {
            VALID = 0;
            alert($.i18n.prop("setting.reboot.RebootDayInvalid"))
            //alert("The input value must less than " + max);
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    }
    return VALID;
}

function ValidateRebootTimeInputValue(id, min, max) {
    var item = $("#" + id).val();
    var VALID;
    if (item != parseInt(item, 10) || item == "" || (item.toString().indexOf('.') != -1)) {  
        VALID = 0;
        alert($.i18n.prop("error.notaNumber"))
        //alert("The input value is not a Number.");
        $("#" + id).focus();
    } else {
        if (item < min) {
            VALID = 0;
            alert($.i18n.prop("setting.reboot.RebootTimeInvalid"))
            //alert("The input value must greater than " + min);
            $("#" + id).focus();
        } else if (item > max) {
            VALID = 0;
            alert($.i18n.prop("setting.reboot.RebootTimeInvalid"))
            //alert("The input value must less than " + max);
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    }
    return VALID;
}

function SetFactoryDefault() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var flag = true;

    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetFactoryDefault",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                // $.LoadingOverlay("hide");
                // alert($.i18n.prop("success.message"));
                // clearSession();                
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Set_Factory_Default_Result == "SUCCESS") {
                    SessionIdleInterval = self.setInterval("sessionCheckToServer()", 5000); // 5 seconds check again
                    //alert($.i18n.prop("success.message"));
                    //$.LoadingOverlay("show");
                    //clearSession();
                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetPreferNetworkMode() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetPreferNetworkMode",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Prefer_Mode_Result == "SUCCESS") {

                switch (obj.Mode) {
                    case "6":
                        $("#select_Mode option[value=6]").prop('selected', true);
                        break;
                    case "3":
                        $("#select_Mode option[value=3]").prop('selected', true);
                        break;
                    // case "1":
                    //     $("#select_Mode option[value=1]").prop('selected', true);
                    //     break;
                }
                switch (obj.Manual) {
                    case "0":
                        $("#network_search option[value=0]").prop('selected', true);
                        break;
                    case "1":
                        $("#network_search option[value=1]").prop('selected', true);
                        break;
                }

                var ConnectStatus = localStorage.getItem("ConnectStatus") ? localStorage.getItem("ConnectStatus") : '';
                var NetworkName = localStorage.getItem("NetworkName") ? localStorage.getItem("NetworkName") : '';
                $("#current_network").text(NetworkName + ' ' + ConnectStatus)
                $("#OLD_network_search").val(obj.Manual);
                //KittyLock
                findKittyKey('MobileNetwork_CommunicationMode', 'select_Mode');

            } else {
                alert(obj.Prefer_Mode_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetPreferNetworkMode() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var mode = $("#select_Mode").val();
    var Manual = $("#network_search").val();
    var OLD_network_search = $("#OLD_network_search").val();
    var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetPreferNetworkMode",
                Mode: mode,
                Manual: Manual,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Prefer_Mode_Result == "SUCCESS") {
                    SetManualSelectNetworkAuto();
                    // if (Manual == OLD_network_search) {
                    //     alert($.i18n.prop("success.message"));
                    //     //clearSession();
                    //     location.reload();
                    // } else {
                    //     SetManualSelectNetworkAuto()
                    // }
                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetAutoUpdateConfig(callFunc1, callFunc2) {
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAutoUpdateConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                //clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                // if (obj.Config == "true") {
                //   $('#Select_Auto_update').bootstrapToggle('on');
                // } else if (obj.Config == "false") {
                //   $('#Select_Auto_update').bootstrapToggle('off');
                // }
                switch (obj.Config) {
                    case "true":
                        $("#Select_Auto_update option[value='true']").prop('selected', true);
                        break;
                    default:
                        $("#Select_Auto_update option[value='false']").prop('selected', true);
                        break;
                }


                //KittyLock
                findKittyKey('SoftwareUpdate_AutomaticUpdate', 'Select_Auto_update');
                findKittyKey('SoftwareUpdate_ManualUpdate_EnableStatus', 'update2');
                findKittyKey('SoftwareUpdate_UpdateTime', 'update_time');

                $("#update_time").val(obj.Time);
                if (callFunc1) {
                    if (callFunc2) {
                        callFunc1(callFunc2);
                    } else {
                        callFunc1();
                    }
                }
            } else {
                //alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetAutoUpdateConfig() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Time = $("#update_time").val();
    var Config;

    Config = $("#Select_Auto_update").val();
    // if ($("#Select_Auto_update").prop('checked')) {
    //   Config = "true";
    // } else {
    //   Config = "false";
    // }
    var flag = SetAutoUpdateConfig_check();

    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetAutoUpdateConfig",
                Config: Config,
                Time: Time,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetAutoUpdateConfig_check() {

    if (!ValidateAutoUpdateInputValue("update_time", 0, 23)) {
        return false;
    } else {
        return true;
    }

}

function ValidateAutoUpdateInputValue(id, min, max) {
    var item = $("#" + id).val();
    var VALID;
    if (item != parseInt(item, 10) || item == "" || (item.toString().indexOf('.') != -1)) {  
        VALID = 0;
        alert($.i18n.prop("error.notaNumber"))
        //alert("The input value is not a Number.");
        $("#" + id).focus();
    } else {
        if (item < min) {
            VALID = 0;
            alert($.i18n.prop("softwareUpdate.timevalid"))
            //alert("The input value must greater than " + min);
            $("#" + id).focus();
        } else if (item > max) {
            VALID = 0;
            alert($.i18n.prop("softwareUpdate.timevalid"))
            //alert("The input value must less than " + max);
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    }
    return VALID;
}

function BackupConfiguration() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "BackupConfiguration",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    var path = obj.File;
                    // var array_temp = new Array();
                    // 
                    // alert($.i18n.prop("success.message"));
                    array_temp = path.split("/");
                    //path = '../' + array_temp[5];
                    path = '../../download/backup.zip';
                    //alert(path)
                    location.href = path;

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function RestoreConfiguration(file) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var File = file;
    var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "RestoreConfiguration",
                File: File,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    RebootDevice();
                    //alert($.i18n.prop("success.message"));
                    //clearSession();
                    // location.reload();

                } else {
                    $.LoadingOverlay("hide");
                    alert($.i18n.prop("error.Restorefailed"));
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetManualSelectNetwork() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var network_new = $("input[name*=network_new]:checked").val();
    if (network_new) {
        var networkArray = network_new.split("|");
        var MCC = networkArray[0];
        var MNC = networkArray[1];
        var Operator = networkArray[2];
        var MNCPCS = networkArray[3];
        var flag;

        if (!MCC) {
            alert($.i18n.prop("error.pleaseselectnetwork"));
            flag = false;
        } else if (!MNC) {
            alert($.i18n.prop("error.pleaseselectnetwork"));
            flag = false;
        } else if (!Operator) {
            alert($.i18n.prop("error.pleaseselectnetwork"));
            flag = false;
        } else {
            flag = true;
        }
    } else {
        alert($.i18n.prop("error.pleaseselectnetwork"));
        flag = false;
    }


    var mode = $("#select_Mode").val();
    var Manual = $("#network_search").val();
    //var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetPreferNetworkMode",
                Mode: mode,
                Manual: Manual,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Prefer_Mode_Result == "SUCCESS") {

                    $.ajax({
                        type: "POST",
                        url: "../../cgi-bin/qcmap_web_cgi",
                        data: {
                            Page: "SetManualSelectNetwork",
                            Automatic: 0,
                            MCC: MCC,
                            MNC: MNC,
                            MNCPCS: MNCPCS,
                            Operator: Operator,
                            token: session_token
                        },
                        dataType: "text",
                        success: function (msgs) {
                            $.LoadingOverlay("hide");
                            var obj = jQuery.parseJSON(msgs);
                            if (obj.result == "AUTH_FAIL") {
                                clearSession();
                                alert($.i18n.prop("error.AUTH_FAIL"));
                                return;
                            }
                            if (obj.result == "Token_mismatch") {
                                clearSession();
                                alert($.i18n.prop("error.Token_mismatch"));
                                return;
                            }
                            if (obj.commit == "Socket Send Error") {
                                clearSession();
                                alert($.i18n.prop("error.SocketSendError"));
                                return;
                            }
                            if (obj.result == "QTApp_Login") {
                                clearSession();
                                alert($.i18n.prop("common.Routerdeviceinuse"));
                                return;
                            }
                            if (obj.Manual_Network_Result == "SUCCESS") {

                                alert($.i18n.prop("success.message"));
                                location.reload();

                            } else {
                                alert(obj.Manual_Network_Result);
                                return;
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            //$.LoadingOverlay("hide");
                            clearSession();
                            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                        }
                    });

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });

    } //flag
}

function SetManualSelectNetworkAuto() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetManualSelectNetwork",
            Automatic: 1,
            MCC: '',
            MNC: '',
            MNCPCS: '',
            Operator: '',
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Manual_Network_Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                alert(obj.Manual_Network_Result);
                location.reload();
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}


function EditConnectClient() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var edit_hostname = $("#edit_hostname").val();
    //var edit_type = $("input[name*=edit_type]:checked").val();
    var edit_type = 'others';
    var Mac_Addr = $("#Mac_Addr").val();

    var form = {
        Page: "SetConnectedClientInfo",
        Mac_Addr: Mac_Addr,
        Name: edit_hostname,
        Icon: edit_type,
        token: session_token
    };

    var flag = EditConnectClient_check();

    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetConnectedClientInfo",
                Mac_Addr: Mac_Addr,
                Name: edit_hostname,
                Icon: edit_type,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetDataUsageStats() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetDataUsageStats",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Get_Usage_Result == "SUCCESS") {
                var SelectM_unit, SelectD_unit;
                //var SelectM_unit = localStorage.getItem("SelectM_unit") ? localStorage.getItem("SelectM_unit") : 'GB';
                //var SelectD_unit = localStorage.getItem("SelectD_unit") ? localStorage.getItem("SelectD_unit") : 'GB';

                var Month = obj.Month > 0 ? obj.Month : 0;
                var Today3d = obj.Today3d > 0 ? obj.Today3d : 0;
                var Yesterday3d = obj.Yesterday3d > 0 ? obj.Yesterday3d : 0;
                var Max1Month = obj.Max1Month > 0 ? obj.Max1Month : 0;
                var Max3Days = obj.Max3Days > 0 ? obj.Max3Days : 0;
                var AutoResetDay = obj.AutoResetDay;
                var LimitData = obj.LimitData;
                var ShowScreen = obj.ShowScreen;
                var _MonthUsedRate, _Yesterday3dUsedRate, _Today3dUsedRate;

                if (Max1Month >= 1048576) //TB
                {
                    SelectM_unit = 'TB';
                    _MonthUsedRate = parseInt((Month / Max1Month * 100));
                    //Max1Month_display = Math.round(Max1Month / (1024 * 1024 * 10)) / 10 + 'TB';
                    Max1Month = Max1Month / (1024 * 1024);
                    Max1Month_display = showAsFloat(Max1Month) + ' TB';
                }
                else if (Max1Month < 1048576 && Max1Month >= 1024) //GB
                {
                    SelectM_unit = 'GB';
                    _MonthUsedRate = parseInt((Month / Max1Month * 100));
                    //Max1Month_display = Math.round(Max1Month / 1024 * 10) / 10 + 'GB';
                    Max1Month = Max1Month / 1024;
                    Max1Month_display = showAsFloat(Max1Month) + ' GB';
                }
                else //MB
                {
                    SelectM_unit = 'MB';
                    _MonthUsedRate = parseInt((Month / Max1Month * 100));
                    Max1Month_display = showAsFloat(Max1Month) + ' MB';
                }

                
                if (Month >= 1048576) //TB
                {
                    var MonthValue = showAsFloat(Math.round((Month / (1024 * 1024)) * 10) / 10);
                    if(MonthValue>1023.9) {
                        Month = '1023.9 TB'
                    }else {
                        Month = MonthValue + ' TB';
                    }
                    console.log('Month:'+Month)
                }

                else if (Month < 1048576 && Month >= 1024) //GB
                {
                    Month = showAsFloat(Math.round(Month / 1024 * 10) / 10) + ' GB';
                }
                else if (Month < 1024 && Month > 0) //MB
                {
                 
                    Month = showAsFloat(Math.round(Month * 10) / 10) + ' MB';

                } else {
                    Month = '0.0 MB';
                }

                if (_MonthUsedRate == 0) {
                    if ((Month != '0.0 MB')) {
                        _MonthUsedRate = 1;
                    } else {
                        _MonthUsedRate = 0;
                    }
                }


                // if (SelectM_unit == "TB") {
                //     if (Month > 0) {
                //         Month = Math.round(Month / 1024 / 1024 * 10) / 10;
                //     }
                //     if (Max1Month > 0) {
                //         _MonthUsedRate = parseInt((Month / Max1Month) * 100);
                //         Max1Month_display = Math.round(Max1Month / 1024 * 1024 * 10) / 10;
                //     } else {
                //         _MonthUsedRate = 0;
                //         Max1Month_display = 0;
                //     }
                //     Max1Month = Math.round(Max1Month / 1024 * 1024 * 10) / 10;
                // }
                // else if (SelectM_unit == "GB") {
                //     if (Month > 0) {
                //         Month = Math.round(Month / 1024 * 10) / 10;
                //     }
                //     if (Max1Month > 0) {
                //         _MonthUsedRate = parseInt((Month / Max1Month) * 100);
                //         Max1Month_display = Math.round(Max1Month / 1024 * 10) / 10;
                //     } else {
                //         _MonthUsedRate = 0;
                //         Max1Month_display = 0;
                //     }
                //     Max1Month = Math.round(Max1Month / 1024 * 10) / 10;
                // } else {
                //     if (Month > 0) {
                //         Month = Math.round(Month * 10) / 10;
                //     }
                //     Max1Month_display = Max1Month;
                //     if (Max1Month > 0) {
                //         _MonthUsedRate = parseInt((Month / Max1Month) * 100);
                //     } else {
                //         _MonthUsedRate = 0;
                //     }
                // }

                // if (SelectD_unit == "GB") {
                //     if (Today3d > 0) {
                //         Today3d = Math.round(Today3d / 1024 * 10) / 10;
                //     }
                //     if (Yesterday3d > 0) {
                //         Yesterday3d = Math.round(Yesterday3d / 1024 * 10) / 10;
                //     }
                //     if (Max3Days > 0) {
                //         _Yesterday3dUsedRate = parseInt((Yesterday3d / Max3Days) * 100);
                //         Max3Days_display = Math.round(Max3Days / 1024 * 10) / 10;
                //     } else {
                //         _Yesterday3dUsedRate = 0;
                //         Max3Days_display = 0;
                //     }
                //     if (Max3Days > 0) {
                //         _Today3dUsedRate = parseInt((Today3d / Max3Days) * 100);
                //     } else {
                //         _Today3dUsedRate = 0;
                //     }
                //     Max3Days = Math.round(Max3Days / 1024 * 10) / 10;
                // } else {
                //     Today3d = Math.round(Today3d * 10) / 10;
                //     Yesterday3d = Math.round(Yesterday3d * 10) / 10;
                //     Max3Days_display = Max3Days;
                //     if (Max3Days > 0) {
                //         _Yesterday3dUsedRate = parseInt((Yesterday3d / Max3Days) * 100);
                //     } else {
                //         _Yesterday3dUsedRate = 0;
                //     }
                //     if (Max3Days > 0) {
                //         _Today3dUsedRate = parseInt((Today3d / Max3Days) * 100);
                //     } else {
                //         _Today3dUsedRate = 0;
                //     }
                // }

                $("#Month_used").text(Month);
                $("#Max1Month_display").text(Max1Month_display);
                if(_MonthUsedRate >= 100)
                {
                    $("#Month-progress").html('<div class="progress-bar progress_warning" data-width="' + _MonthUsedRate + '%" aria-valuenow="' + _MonthUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _MonthUsedRate + '%;" >' + '</div>')
                }
                else
                {
                    $("#Month-progress").html('<div class="progress-bar progress_normal" data-width="' + _MonthUsedRate + '%" aria-valuenow="' + _MonthUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _MonthUsedRate + '%;" >' + '</div>')                 
                }
                //$("#Yesterday3d_used").text(Yesterday3d + SelectD_unit);
                //$(".Max3Days_display").text(Max3Days_display + SelectD_unit);
                //$("#Today3d_used").text(Today3d + SelectD_unit);
                //$("#Yesterday3d-progress").html('<div class="progress-bar bg-success" data-width="' + _Yesterday3dUsedRate + '%" aria-valuenow="' + _Yesterday3dUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _Yesterday3dUsedRate + '%;" >' + _Yesterday3dUsedRate + '%</div>')
                //$("#Today3d-progress").html('<div class="progress-bar bg-success" data-width="' + _Today3dUsedRate + '%" aria-valuenow="' + _Today3dUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _Today3dUsedRate + '%;" >' + _Today3dUsedRate + '%</div>')


                $("#AutoResetDay").val(AutoResetDay);
                $("#Max1Month").val(parseInt(Max1Month));
                //$("#Max3Days").val(Max3Days);

                // if (LimitData == 1) {
                //     $('#Select_LimitData').bootstrapToggle('on');
                // } else if (LimitData == 0) {
                //     $('#Select_LimitData').bootstrapToggle('off');
                // }

                switch (ShowScreen) {
                    case "0":
                        $("#ShowScreen option[value='0']").prop('selected', true);
                        break;
                    case "1":
                        $("#ShowScreen option[value='1']").prop('selected', true);
                        break;
                    case "2":
                        $("#ShowScreen option[value='2']").prop('selected', true);
                        break;
                }

                switch (SelectM_unit) {
                    case "TB":
                        $("#SelectM_unit option[value='TB']").prop('selected', true);
                        break;
                    case "GB":
                        $("#SelectM_unit option[value='GB']").prop('selected', true);
                        break;
                    case "MB":
                        $("#SelectM_unit option[value='MB']").prop('selected', true);
                        break;
                }

                $("#OLD_Max1Month").val(parseInt(Max1Month));
                $("#OLD_SelectM_unit").val(SelectM_unit);

            } else {
                alert(obj.Get_Usage_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            // alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function checkSetDataUsageDialog() 
{
    SetDataUsageConfig();
    //there is no communication stop in docomo
    // var OLD_Max1Month = $("#OLD_Max1Month").val();
    // var Max1Month = $("#Max1Month").val();
    // var OLD_SelectM_unit = $("#OLD_SelectM_unit").val();
    // var SelectM_unit = $("#SelectM_unit").val();
    // if(OLD_Max1Month != Max1Month || OLD_SelectM_unit != SelectM_unit)
    // {
    //     //Set include 窶廴ax Data Usage窶�,popup dialog
    //     $("#applyWifiDatausageDisconnectModal").modal('show');
    // }
    // else
    // {
    //     SetDataUsageConfig();
    // }
}

function GetDataUsageStatsHome() {
    var Error_Msg = "";
    var flag = true;
    // var checkLogin = checkSession();
    // if (checkLogin == "off") {
    //   //backToHome();
    //   flag = false;
    //   //return false;
    // }
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetDataUsageStats",
                mask: "0",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Get_Usage_Result == "SUCCESS") {
                    var SelectM_unit, SelectD_unit;
                    //var SelectM_unit = localStorage.getItem("SelectM_unit") ? localStorage.getItem("SelectM_unit") : 'GB';
                    //var SelectD_unit = localStorage.getItem("SelectD_unit") ? localStorage.getItem("SelectD_unit") : 'GB';

                    var Month = obj.Month > 0 ? obj.Month : 0;
                    var Today3d = obj.Today3d > 0 ? obj.Today3d : 0;
                    var Yesterday3d = obj.Yesterday3d > 0 ? obj.Yesterday3d : 0;
                    var Max1Month = obj.Max1Month > 0 ? obj.Max1Month : 0;
                    var Max3Days = obj.Max3Days > 0 ? obj.Max3Days : 0;
                    var AutoResetDay = obj.AutoResetDay;
                    var LimitData = obj.LimitData;
                    var ShowScreen = obj.ShowScreen;
                    var _MonthUsedRate, _Yesterday3dUsedRate, _Today3dUsedRate;
                    var LastReset = obj.LastReset != 0 ? obj.LastReset : '';
                    var Duration = obj.Duration > 0 ? obj.Duration : 0;


                    durationTimeDisplay(Duration);

                   
                    if (Max1Month >= 1048576) //TB
                    {
                        SelectM_unit = 'TB';
                        _MonthUsedRate = parseInt((Month / Max1Month) * 100);
                        //Max1Month_display = Math.round(Max1Month / (1024 * 1024 * 10)) / 10 + 'TB';
                        Max1Month = Max1Month / (1024 * 1024);
                        Max1Month_display = showAsFloat(Max1Month) + ' TB';
                    }
                    else if (Max1Month < 1048576 && Max1Month >= 1024) //GB
                    {
                        SelectM_unit = 'GB';
                        _MonthUsedRate = parseInt((Month / Max1Month) * 100);
                        //Max1Month_display = Math.round(Max1Month / 1024 * 10) / 10 + 'GB';
                        Max1Month = Max1Month / 1024;
                        Max1Month_display = showAsFloat(Max1Month) + ' GB';
                    }
                    else //MB
                    {
                        SelectM_unit = 'MB';
                        _MonthUsedRate = parseInt((Month / Max1Month) * 100);
                        Max1Month_display = showAsFloat(Max1Month) + ' MB';
                    }

                    
                    if (Month >= 1048576) //TB
                    {
                        var MonthValue = showAsFloat(Math.round((Month / (1024 * 1024)) * 10) / 10);
                        if(MonthValue>1023.9) {
                            Month = '1023.9 TB'
                        }else {
                            Month = MonthValue + ' TB';
                        }
                        console.log('Month:'+Month)
                    }
                    else if (Month < 1048576 && Month >= 1024) //GB
                    {
                        Month = showAsFloat(Math.round(Month / 1024 * 10) / 10) + ' GB';
                    }
                    else if (Month < 1024 && Month > 0) //MB
                    {
                        Month = showAsFloat(Math.round(Month * 10) / 10) + ' MB';
                    } else {
                        Month = '0.0 MB';
                    }

                    if (Month != '0.0 MB') {
                        if (_MonthUsedRate == 0) {
                            _MonthUsedRate = 1;
                        }
                    }
                    // if (SelectD_unit == "GB") {
                    //     if (Today3d > 0) {
                    //         Today3d = Math.round(Today3d / 1024 * 10) / 10;
                    //     }
                    //     if (Yesterday3d > 0) {
                    //         Yesterday3d = Math.round(Yesterday3d / 1024 * 10) / 10;
                    //     }
                    //     if (Max3Days > 0) {
                    //         _Yesterday3dUsedRate = parseInt((Yesterday3d / Max3Days) * 100);
                    //         Max3Days_display = Math.round(Max3Days / 1024 * 10) / 10;
                    //     } else {
                    //         _Yesterday3dUsedRate = 0;
                    //         Max3Days_display = 0;
                    //     }
                    //     if (Max3Days > 0) {
                    //         _Today3dUsedRate = parseInt((Today3d / Max3Days) * 100);
                    //     } else {
                    //         _Today3dUsedRate = 0;
                    //     }
                    //     Max3Days = Math.round(Max3Days / 1024 * 10) / 10;
                    // } else {
                    //     Today3d = Math.round(Today3d * 10) / 10;
                    //     Yesterday3d = Math.round(Yesterday3d * 10) / 10;
                    //     Max3Days_display = Max3Days;
                    //     if (Max3Days > 0) {
                    //         _Yesterday3dUsedRate = parseInt((Yesterday3d / Max3Days) * 100);
                    //     } else {
                    //         _Yesterday3dUsedRate = 0;
                    //     }
                    //     if (Max3Days > 0) {
                    //         _Today3dUsedRate = parseInt((Today3d / Max3Days) * 100);
                    //     } else {
                    //         _Today3dUsedRate = 0;
                    //     }
                    // }

                    // $("#Month_used").text(Month+SelectM_unit);
                    // $("#Max1Month_display").text(Max1Month_display+SelectM_unit);
                    // $("#Month-progress").html('<div class="progress-bar bg-success" data-width="' + _MonthUsedRate + '%" aria-valuenow="' + _MonthUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _MonthUsedRate + '%;" >' + _MonthUsedRate + '%</div>')

                    // $("#Yesterday3d_used").text(Yesterday3d+SelectD_unit);
                    // $(".Max3Days_display").text(Max3Days_display+SelectD_unit);
                    // $("#Today3d_used").text(Today3d+SelectD_unit);
                    // $("#Yesterday3d-progress").html('<div class="progress-bar bg-success" data-width="' + _Yesterday3dUsedRate + '%" aria-valuenow="' + _Yesterday3dUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _Yesterday3dUsedRate + '%;" >' + _Yesterday3dUsedRate + '%</div>')
                    // $("#Today3d-progress").html('<div class="progress-bar bg-success" data-width="' + _Today3dUsedRate + '%" aria-valuenow="' + _Today3dUsedRate + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _Today3dUsedRate + '%;" >' + _Today3dUsedRate + '%</div>')


                    //$("#AutoResetDay").val(AutoResetDay);
                    //$("#Max1Month").val(Max1Month);
                    $("#Max1Month").val(parseInt(Max1Month));
                    //$("#Max3Days").val(Max3Days);

                    var of = '<span data-locale="common.of">'+ $.i18n.prop("common.of") +'</span>';
                    var data1 = Month +  of  + Max1Month_display;
                    //var data2 = Today3d + ' ' + SelectD_unit + ' of ' + Max3Days_display + ' ' + SelectD_unit + ' (3 days)';
                    $("#data1").html(data1);
                    //$("#data2").text(data2);
                    $("#LastReset").text(LastReset)

                    var random = Math.random().toString(16).substring(6);
                    $("#csrftoken").val(random);                      
                    //check session valid
                    if(session_token)
                    {
                        homeSessionCheckToServerInterval = self.setInterval("homeSessionCheckToServer()", 5000); // 5 seconds check again
                    }

                } else {
                    //alert('XXX' + obj.Get_Usage_Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function showAsFloat(n) {
    return parseFloat(n).toFixed(1);
}

function ConfirmSetDataUsageReset() {
    $('#confirmSetDataUsageReset').modal('show');
}

function SetDataUsageReset() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        homeSessionCheckToServerInterval = window.clearInterval(homeSessionCheckToServerInterval);
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetDataUsageReset",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Reset_Usage_Result == "SUCCESS") {
                    alert($.i18n.prop("success.message"));
                    // clearSession();
                    location.reload();

                } else {
                    alert(obj.Reset_Usage_Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetDataUsageConfig() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    //var ShowScreen = $("#ShowScreen").val();
    var ShowScreen = 2;
    //var AutoResetDay = $("#AutoResetDay").val();
    var AutoResetDay = 1;
    var Max1Month = $("#Max1Month").val();
    var SelectM_unit = $("#SelectM_unit").val();
    var Max3Days = 0;
    var SelectD_unit = 'GB';

    var LimitData = 0;

    // if ($("#Select_LimitData").prop('checked')) {
    //     LimitData = 1;
    // } else {
    //     LimitData = 0;
    // }

    switch (SelectM_unit) {
        case "TB":
            Max1Month = Max1Month * 1024 * 1024;
            break;
        case "GB":
            Max1Month = Max1Month * 1024;
            break;
        case "MB":
            break;
    }

    // switch (SelectD_unit) {
    //     case "GB":
    //         Max3Days = Max3Days * 1024;
    //         break;
    //     case "MB":
    //         break;
    // }

    var form = {
        Page: "SetDataUsageConfig",
        Max1Month: Max1Month,
        Max3Days: Max3Days,
        AutoResetDay: AutoResetDay,
        LimitData: LimitData,
        ShowScreen: ShowScreen,
        token: session_token
    };
    var flag = SetDataUsageConfig_check();
    //flag = false;

    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetDataUsageConfig",
                Max1Month: Max1Month,
                Max3Days: Max3Days,
                AutoResetDay: AutoResetDay,
                LimitData: LimitData,
                ShowScreen: ShowScreen,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Set_Usage_Result == "SUCCESS") {

                    //localStorage.setItem("SelectM_unit", SelectM_unit);
                    //localStorage.setItem("SelectD_unit", SelectD_unit);
                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.Set_Usage_Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetDataUsageConfig_check() {

    if (!ValidateInputValue("Max1Month", 1, 999, $.i18n.prop("setting.dataUsage.MaxDataUsage"))) {
        return false;
    } else {
        return true;
    }

}


function GetGlobalAdvanceWifiConfig(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetGlobalAdvanceWifiConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                //clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Get_Advance_Result == "SUCCESS") {

                var TxPower = obj.TxPower;
                var TCP = obj.TCP;
                var UDP = obj.UDP;
                var SleepMode = obj.SleepMode;
                var SleepTime = obj.SleepTime;

                $("#TCP_NAT_Time").val(TCP);
                $("#UDP_NAT_Time").val(UDP);

                // if (SleepMode == 1) {
                //     $('#Select_SleepMode').bootstrapToggle('on');
                // } else if (SleepMode == 0) {
                //     $('#Select_SleepMode').bootstrapToggle('off');
                // }

                switch (SleepMode) {
                    case "1":
                        $("#Select_SleepMode option[value='1']").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_SleepMode option[value='0']").prop('selected', true);
                        break;
                }

                switch (TxPower) {
                    case "1":
                        $("#Select_TX option[value='1']").prop('selected', true);
                        break;
                    case "0":
                        $("#Select_TX option[value='0']").prop('selected', true);
                        break;
                }

                switch (SleepTime) {
                    case "5":
                        $("#Select_SleepMode_Timer option[value='5']").prop('selected', true);
                        break;
                    case "10":
                        $("#Select_SleepMode_Timer option[value='10']").prop('selected', true);
                        break;
                    case "15":
                        $("#Select_SleepMode_Timer option[value='15']").prop('selected', true);
                        break;
                }

                //KittyLock
                findKittyKey('TxPower', 'Select_TX');
                findKittyKey('TcpNatTimer', 'TCP_NAT_Time');
                findKittyKey('UcpNatTimer', 'UDP_NAT_Time');
                findKittyKey('Channel', 'Select_channel_2');
                findKittyKey('Channel', 'Select_channel_5');
                findKittyKey('WifiBandwith', 'Select_Bandwidth_2');
                findKittyKey('WifiBandwith', 'Select_Bandwidth_5');
                findKittyKey('WifiMode', 'Select_Mode'); 
                findKittyKey('WifiMode', 'Select_channel_2');
                findKittyKey('WifiMode', 'Select_channel_5');
                findKittyKey('WifiMode', 'Select_Mode'); 
                findKittyKey('WifiMode', 'Select_Bandwidth_2');
                findKittyKey('WifiMode', 'Select_Bandwidth_5');
                if (callFunc1) {
                    callFunc1();
                }

            } else {
                alert(obj.Get_Advance_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function GetGlobalWifiConfigAtAdvance(callFunc1, callFunc2) {
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetGlobalWifiConfig",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.GetGlobalWifiResult == "SUCCESS") {
                $("#wifi_status").val(obj.Status);
                $('#Isolation').val(obj.Isolation);
                // $('#ShowSecurity').val(obj.ShowSecurity);
                $('#ApMode').val(obj.ApMode);
                $('#Bandwidth').val(obj.Bandwidth);
                $("#OLD_Bandselection5").val(obj.Bandselection5);
                $("#OLD_Bandwidth5").val(obj.Bandwidth5);
                $("#OLD_Bandwidth24").val(obj.Bandwidth24);
                $("#OLD_Channel5").val(obj.Channel5);
                $("#OLD_Channel24").val(obj.Channel24);
                $("#OLD_TxPower").val(obj.TxPower);

                $("#Select_channel_2 option[value='" + obj.Channel24 + "']").prop('selected', true);
                $("#Select_Bandwidth_2 option[value='" + obj.Bandwidth24 + "']").prop('selected', true);
                $("#Select_channel_5 option[value='" + obj.Channel5 + "']").prop('selected', true);
                $("#Select_Bandwidth_5 option[value='" + obj.Bandwidth5 + "']").prop('selected', true);
                $("#Select_TX option[value='" + obj.TxPower + "']").prop('selected', true);
                switch(String(obj.Bandselection5)) {
                    case "0":
                        $("#bandSelectionCheckbox52").prop('checked', true);
                        break;
                    case "1":
                        $("#bandSelectionCheckbox53").prop('checked', true);
                        break;
                    case "2":
                        $("#bandSelectionCheckbox56").prop('checked', true);
                        break;
                    case "3":
                        $("#bandSelectionCheckbox52").prop('checked', true);
                        $("#bandSelectionCheckbox53").prop('checked', true);
                        break;
                    case "4":
                        $("#bandSelectionCheckbox52").prop('checked', true);
                        $("#bandSelectionCheckbox56").prop('checked', true);
                        break;
                    case "5":
                        $("#bandSelectionCheckbox53").prop('checked', true);
                        $("#bandSelectionCheckbox56").prop('checked', true);
                        break;
                    case "6":
                        $("#bandSelectionCheckbox52").prop('checked', true);
                        $("#bandSelectionCheckbox53").prop('checked', true);
                        $("#bandSelectionCheckbox56").prop('checked', true);
                        break;
                }

                if (callFunc1) {
                    if (callFunc2) {
                        callFunc1(callFunc2);
                    } else {
                        callFunc1();
                    }
                }

            } else {
                alert(obj.GetGlobalWifiResult);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function beforeConfirmAC()
{
    if (!ValidateInputValue("TCP_NAT_Time", 30, 86400, $.i18n.prop("wifiadvance.TCPNATTimer"))) {
        return ;
    } else if (!ValidateInputValue("UDP_NAT_Time", 30, 86400, $.i18n.prop("wifiadvance.UDPNATTimer"))) {
        return ;
    } else {
        $("#applyWifiAdvanceDisconnectModal").modal('show');
    }    
}



function confirmACIndoor() {
    clearInterval(acTimer);
    $.LoadingOverlay("show");
    var Select_Mode = $("#Select_Mode").val();
    if (Select_Mode == "g") {
        SetGlobalAdvanceWifiConfig();
    } else {
        //$.LoadingOverlay("show");
        // var Value = 1;
        // if(Value=="0") { //no AC
        //   $.LoadingOverlay("hide");
        //   $("#confirmACNo").modal('show');
        // }else if(Value=="1") { //AC
        //   $.LoadingOverlay("hide");
        //   $("#confirmACYes").modal('show');
        // }    

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetACStatus",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    if (obj.Value == "0") { //no AC
                        //$("#confirmACYes").modal('hide');
                        //DFSCountdown();
                        $("#door").val('outdoor');
                        SetGlobalAdvanceWifiConfig();
                    } else if (obj.Value == "1") { //AC
                        //confirmInOutdoor('indoor');
                        $("#door").val('indoor');
                        SetGlobalAdvanceWifiConfig();
                    }

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });

    }

}

function confirmACOutdoor() {
    clearInterval(acTimer);
    $.LoadingOverlay("show");
    var Select_Mode = $("#Select_Mode").val();
    if (Select_Mode == "g") {
        SetGlobalAdvanceWifiConfig();
    } else {
        
        // var Value = 1;
        // if(Value=="0") { //no AC
        //   $.LoadingOverlay("hide");
        //   $("#confirmACNo").modal('show');
        // }else if(Value=="1") { //AC
        //   $.LoadingOverlay("hide");
        //   $("#confirmACYes").modal('show');
        // }    

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetACStatus",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    if (obj.Value == "0") { //no AC
                        //$("#confirmACYes").modal('hide');
                        //DFSCountdown();
                        $("#door").val('outdoor');
                        //$("#confirmACNo").modal('show');
                        SetGlobalAdvanceWifiConfig();
                    } else if (obj.Value == "1") { //AC
                        //confirmInOutdoor('indoor');
                        $("#door").val('outdoor');
                        SetGlobalAdvanceWifiConfig();
                    }

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });

    }

}

function confirmACIndoorAtBasic() {
    clearInterval(acTimer);
    $("#confirmOpen").modal("hide");
    $.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetACStatus",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            //$.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                if (obj.Value == "0") { //no AC
                    // DFSCountdown();
                    // $("#confirmACNo").modal('show');
                    $("#door").val('outdoor');
                    SetBasicWifiAPConfigAndDFS();
                } else if (obj.Value == "1") { //AC
                    //confirmInOutdoor('indoor');
                    $("#door").val('indoor');
                    SetBasicWifiAPConfigAndDFS();
                }
            } else {
                alert(obj.Result);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}


function confirmOutdoorAtBasic() {
    clearInterval(acTimer);
    $.LoadingOverlay("show");
    $("#door").val('outdoor');
    SetBasicWifiAPConfigAndDFS();
    // $("#confirmACYes").modal('hide');
    // DFSCountdown();
    // $("#confirmACNo").modal('show');

}   

// function confirmDFSCheck(door) {
//   $("#door").val(door);
//   $("#confirmACNo").modal("show");
// }

function confirmInOutdoor() {
    // $("#door").val(door);
    // SetGlobalAdvanceWifiConfig();
    $("#confirmACYes").modal('hide');
    DFSCountdown();
    // $("#confirmACNo").modal('show');

}

function SetGlobalAdvanceWifiConfig() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var TxPower = $("#Select_TX").val();
    var TCP = $("#TCP_NAT_Time").val();
    var UDP = $("#UDP_NAT_Time").val();
    var SleepTime = $("#Select_SleepMode_Timer").val();
    var SleepMode;
    //var Select_Mode = $("#Select_Mode").val();


    // if ($("#Select_SleepMode").prop('checked')) {
    //     SleepMode = 1;
    // } else {
    //     SleepMode = 0;
    // }
    SleepMode = $("#Select_SleepMode").val();

    var form = {
        Page: "SetGlobalAdvanceWifiConfig",
        TxPower: TxPower,
        TCP: TCP,
        UDP: UDP,
        SleepMode: SleepMode,
        SleepTime: SleepTime,
        token: session_token
    };
    var flag = SetGlobalAdvanceWifiConfig_check();
    //flag = false;

    if (flag) {
        //$.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetGlobalAdvanceWifiConfig",
                TxPower: TxPower,
                TCP: TCP,
                UDP: UDP,
                SleepMode: SleepMode,
                SleepTime: SleepTime,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Set_Advance_Result == "SUCCESS") {

                    //alert($.i18n.prop("success.message"));
                    //location.reload();
                    SetGlobalWifiConfigAdvance();

                } else {
                    alert(obj.Set_Advance_Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetGlobalAdvanceWifiConfig_check() {

    if (!ValidateInputValue("TCP_NAT_Time", 30, 86400, $.i18n.prop("wifiadvance.TCPNATTimer"))) {
        $.LoadingOverlay("hide");
        return false;
    } else if (!ValidateInputValue("UDP_NAT_Time", 30, 86400, $.i18n.prop("wifiadvance.UDPNATTimer"))) {
        $.LoadingOverlay("hide");
        return false;
    } else {
        return true;
    }

}

function addMacAddressModal() {
    var card_address = '';
    var macAmount = $("#macAmount").val();
    var displayAmount = 10 - macAmount;
    if (macAmount >= 10) {
        alert($.i18n.prop("lan.wifi.mac.filter.over10"));
    }
    else {
        for (i = 1; i <= displayAmount; i++) {

            card_address += '<div class="col-12 col-md-12 col-lg-12 text-center mb-2">' +
                '<div class="flex">' +
                '<div class="item flex-3 ">' +
                '<div class="row flex-item-center">' +
                '<div class="text-left col-12 col-md-5 col-lg-5">' +
                '<small class="card-title-font"><span data-locale="lan.wifi.mac.filter.Desc">' + $.i18n.prop("lan.wifi.mac.filter.Desc") + '</span></small><br>' +
                '<input type="hidden" name="mac" id="description" class="required mac" value="">' +
                '<div class="descripValDe">' +
                '<input id="description' + i + '" type="text" value=""  maxlength="32">' +
                '</div>' +
                '</div>' +
                '<div class="text-left col-12 col-md-7 col-lg-6">' +
                '<small class="card-title-font"><span data-locale="lan.wifi.mac.filter.MACAddress">' + $.i18n.prop("lan.wifi.mac.filter.MACAddress") + '</span></small><br>' +
                '<div>' +
                '<input type="hidden" name="mac" id="mac" class="required mac" value="">' +
                '<div id="macValDe">' +
                '<input type="text" id="macid' + i + '" value="" name="mac' + i + '[]" maxlength="2">' +
                '&nbsp;<span class="mac-address-font">:</span>&nbsp;' +
                '<input type="text" value="" name="mac' + i + '[]" maxlength="2">' +
                '&nbsp;<span class="mac-address-font">:</span>&nbsp;' +
                '<input type="text" value="" name="mac' + i + '[]" maxlength="2">' +
                '&nbsp;<span class="mac-address-font">:</span>&nbsp;' +
                '<input type="text" value="" name="mac' + i + '[]" maxlength="2">' +
                '&nbsp;<span class="mac-address-font">:</span>&nbsp;' +
                '<input type="text" value="" name="mac' + i + '[]" maxlength="2">' +
                '&nbsp;<span class="mac-address-font">:</span>&nbsp;' +
                '<input type="text" value="" name="mac' + i + '[]" maxlength="2">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        $("#card_address").html(card_address);
        $("#addMacAddress").modal('show');
    }

}

function addMacAddress() {
    $("#addApplyMACDisconnectModal").modal("hide");
    var mac1address = mac2address = mac3address = mac4address = mac5address = mac6address = mac7address = mac8address = mac9address = mac10address = '';
    var fullregexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    var regexp = /[A-Fa-f0-9]{2}/i;
    var flag = '';
    var OLD_MACList = $("#OLD_MACList").val().toLowerCase();
    for (i = 1; i <= 10; i++) {
        $('input[name="mac' + i + '[]"]').each(function () {
            if ($(this).val() && flag != 'false') {
                if (!regexp.test($(this).val())) {
                    //alert($.i18n.prop("error.invalidformat"));
                    alert($.i18n.prop("home.MACAddress") + i + $.i18n.prop("error.macaddressformat"))
                    $(this).focus();
                    flag = 'false';
                    return false; 
                } else {
                    switch (i) {
                        case 1:
                            mac1address += $(this).val() + ':';
                            break;
                        case 2:
                            mac2address += $(this).val() + ':';
                            break;
                        case 3:
                            mac3address += $(this).val() + ':';
                            break;
                        case 4:
                            mac4address += $(this).val() + ':';
                            break;
                        case 5:
                            mac5address += $(this).val() + ':';
                            break;
                        case 6:
                            mac6address += $(this).val() + ':';
                            break;
                        case 7:
                            mac7address += $(this).val() + ':';
                            break;
                        case 8:
                            mac8address += $(this).val() + ':';
                            break;
                        case 9:
                            mac9address += $(this).val() + ':';
                            break;
                        case 10:
                            mac10address += $(this).val() + ':';
                            break;
                    }
                }
            } else {
                // alert('not be empty');
                // $(this).focus();
                // flag = false;
                // return false;      
            }
        });
        if(flag == 'false')
        {
            break;
        }
    }
    if (flag != 'false') {
        var flag1 = flag2 = flag3 = flag4 = flag5 = flag6 = flag7 = flag8 = flag9 = flag10 = true;
        var MACList = '';
        var desc1 = desc2 = desc3 = desc4 = desc5 = desc6 = desc7 = desc8 = desc9 = desc10 = '';
        mac1address = mac1address.substring(0, mac1address.length - 1);
        mac2address = mac2address.substring(0, mac2address.length - 1);
        mac3address = mac3address.substring(0, mac3address.length - 1);
        mac4address = mac4address.substring(0, mac4address.length - 1);
        mac5address = mac5address.substring(0, mac5address.length - 1);
        mac6address = mac6address.substring(0, mac6address.length - 1);
        mac7address = mac7address.substring(0, mac7address.length - 1);
        mac8address = mac8address.substring(0, mac8address.length - 1);
        mac9address = mac9address.substring(0, mac9address.length - 1);
        mac10address = mac10address.substring(0, mac10address.length - 1);

        desc1 = $("#description1").val() ? $("#description1").val() : '';
        desc2 = $("#description2").val() ? $("#description2").val() : '';
        desc3 = $("#description3").val() ? $("#description3").val() : '';
        desc4 = $("#description4").val() ? $("#description4").val() : '';
        desc5 = $("#description5").val() ? $("#description5").val() : '';
        desc6 = $("#description6").val() ? $("#description6").val() : '';
        desc7 = $("#description7").val() ? $("#description7").val() : '';
        desc8 = $("#description8").val() ? $("#description8").val() : '';
        desc9 = $("#description9").val() ? $("#description9").val() : '';
        desc10 = $("#description10").val() ? $("#description10").val() : '';

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {

            if (mac1address != '' || desc1 != '') {
                var find1 = OLD_MACList.search(mac1address.toLowerCase());
                if (!fullregexp.test(mac1address)) {
                    alert($.i18n.prop("home.MACAddress") + '1' + $.i18n.prop("error.macaddressformat"))
                    $("#macid1").focus();
                    flag1 = false;
                } 
                else if(find1 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid1").focus();
                    flag1 = false;                
                }
                else {
                    if (checkNameStringType3('description1', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        desc1 = strReplace(desc1);
                        flag1 = true;
                        MACList += mac1address + '|' + desc1 + ',';
                    } else {
                        flag1 = false;
                        //$("#macid1").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {

            if (mac2address != '' || desc2 != '') {
                var find2 = OLD_MACList.search(mac2address.toLowerCase());
                if (!fullregexp.test(mac2address)) {
                    alert($.i18n.prop("home.MACAddress") + '2' + $.i18n.prop("error.macaddressformat"))
                    $("#macid2").focus();
                    flag2 = false;
                } 
                else if(find2 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid2").focus();
                    flag2 = false;                
                }
                else {
                    if (checkNameStringType3('description2', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc2 = $("#description2").val();
                        desc2 = strReplace(desc2);
                        flag2 = true;
                        MACList += mac2address + '|' + desc2 + ',';
                    } else {
                        flag2 = false;
                        //$("#macid2").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac3address != '' || desc3 != '') {
                var find3 = OLD_MACList.search(mac3address.toLowerCase());
                if (!fullregexp.test(mac3address)) {
                    alert($.i18n.prop("home.MACAddress") + '3' + $.i18n.prop("error.macaddressformat"))
                    $("#macid3").focus();
                    flag3 = false;
                } 
                else if(find3 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid3").focus();
                    flag3 = false;                
                }
                else {
                    if (checkNameStringType3('description3', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc3 = $("#description3").val();
                        desc3 = strReplace(desc3);
                        flag3 = true;
                        MACList += mac3address + '|' + desc3 + ',';
                    } else {
                        flag3 = false;
                        //$("#macid3").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac4address != '' || desc4 != '') {
                var find4 = OLD_MACList.search(mac4address.toLowerCase());
                if (!fullregexp.test(mac4address)) {
                    alert($.i18n.prop("home.MACAddress") + '4' + $.i18n.prop("error.macaddressformat"))
                    $("#macid4").focus();
                    flag4 = false;
                } 
                else if(find4 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid4").focus();
                    flag4 = false;                
                }
                else {
                    if (checkNameStringType3('description4', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc4 = $("#description4").val();
                        desc4 = strReplace(desc4);
                        flag4 = true;
                        MACList += mac4address + '|' + desc4 + ',';
                    } else {
                        flag4 = false;
                        //$("#macid4").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac5address != '' || desc5 != '') {
                var find5 = OLD_MACList.search(mac5address.toLowerCase());
                if (!fullregexp.test(mac5address)) {
                    alert($.i18n.prop("home.MACAddress") + '5' + $.i18n.prop("error.macaddressformat"))
                    $("#macid5").focus();
                    flag5 = false;
                } 
                else if(find5 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid5").focus();
                    flag5 = false;                
                }
                else {
                    if (checkNameStringType3('description5', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc5 = $("#description5").val();
                        desc5 = strReplace(desc5);
                        flag5 = true;
                        MACList += mac5address + '|' + desc5 + ',';
                    } else {
                        flag5 = false;
                        //$("#macid5").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac6address != '' || desc6 != '') {
                var find6 = OLD_MACList.search(mac6address.toLowerCase());
                if (!fullregexp.test(mac6address)) {
                    alert($.i18n.prop("home.MACAddress") + '6' + $.i18n.prop("error.macaddressformat"))
                    $("#macid6").focus();
                    flag6 = false;
                } 
                else if(find6 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid6").focus();
                    flag6 = false;                
                }
                else {
                    if (checkNameStringType3('description6', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc6 = $("#description6").val();
                        desc6 = strReplace(desc6);
                        flag6 = true;
                        MACList += mac6address + '|' + desc6 + ',';
                    } else {
                        flag6 = false;
                        //$("#macid6").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac7address != '' || desc7 != '') {
                var find7 = OLD_MACList.search(mac7address.toLowerCase());
                if (!fullregexp.test(mac7address)) {
                    alert($.i18n.prop("home.MACAddress") + '7' + $.i18n.prop("error.macaddressformat"))
                    $("#macid7").focus();
                    flag7 = false;
                } 
                else if(find7 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid7").focus();
                    flag7 = false;                
                }
                else {
                    if (checkNameStringType3('description7', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc7 = $("#description7").val();
                        desc7 = strReplace(desc7);
                        flag7 = true;
                        MACList += mac7address + '|' + desc7 + ',';
                    } else {
                        flag7 = false;
                        //$("#macid7").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac8address != '' || desc8 != '') {
                var find8 = OLD_MACList.search(mac8address.toLowerCase());
                if (!fullregexp.test(mac8address)) {
                    alert($.i18n.prop("home.MACAddress") + '8' + $.i18n.prop("error.macaddressformat"))
                    $("#macid8").focus();
                    flag8 = false;
                }
                else if(find8 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid8").focus();
                    flag8 = false;                
                }
                else {
                    if (checkNameStringType3('description8', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc8 = $("#description8").val();
                        desc8 = strReplace(desc8);
                        flag8 = true;
                        MACList += mac8address + '|' + desc8 + ',';
                    } else {
                        flag8 = false;
                        //$("#macid8").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac9address != '' || desc9 != '') {
                var find9 = OLD_MACList.search(mac9address.toLowerCase());
                if (!fullregexp.test(mac9address)) {
                    alert($.i18n.prop("home.MACAddress") + '9' + $.i18n.prop("error.macaddressformat"))
                    $("#macid9").focus();
                    flag9 = false;
                }
                else if(find9 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid9").focus();
                    flag9 = false;                
                }
                else {
                    if (checkNameStringType3('description9', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc9 = $("#description9").val();
                        desc9 = strReplace(desc9);
                        flag9 = true;
                        MACList += mac9address + '|' + desc9 + ',';
                    } else {
                        flag9 = false;
                        //$("#macid9").focus();
                    }
                }
            }
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if (mac10address != '' || desc10 != '') {
                var find10 = OLD_MACList.search(mac10address.toLowerCase());
                if (!fullregexp.test(mac10address)) {
                    alert($.i18n.prop("home.MACAddress") + '10' + $.i18n.prop("error.macaddressformat"))
                    $("#macid10").focus();
                    flag10 = false;
                }
                else if(find10 != "-1") 
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    $("#macid10").focus();
                    flag10 = false;                
                }
                else {
                    if (checkNameStringType3('description10', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        //desc10 = $("#description10").val();
                        desc10 = strReplace(desc10);
                        flag10 = true;
                        MACList += mac10address + '|' + desc10 + ',';
                    } else {
                        flag10 = false;
                        //$("#macid10").focus();
                    }
                }
            }
        }

        MACList = MACList.substring(0, MACList.length - 1);

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && flag8 && flag9 && flag10) {
            if(checkMacaddressIsExist(mac1address,mac2address,mac3address,mac4address,mac5address,mac6address,mac7address,mac8address,mac9address,mac10address))
            {
                alert($.i18n.prop("error.macaddressduplicated"));
            } 
            else if(MACList != "")
            {            
                $.LoadingOverlay("show");
                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_web_cgi",
                    data: {
                        Page: "AddMACAddressFilterMACList",
                        MACList: MACList,
                        token: session_token
                    },
                    dataType: "text",
                    success: function (msgs) {
                        $.LoadingOverlay("hide");
                        var obj = jQuery.parseJSON(msgs);
                        if (obj.result == "AUTH_FAIL") {
                            clearSession();
                            alert($.i18n.prop("error.AUTH_FAIL"));
                            return;
                        }
                        if (obj.result == "Token_mismatch") {
                            clearSession();
                            alert($.i18n.prop("error.Token_mismatch"));
                            return;
                        }
                        if (obj.commit == "Socket Send Error") {
                            clearSession();
                            alert($.i18n.prop("error.SocketSendError"));
                            return;
                        }
                        if (obj.result == "QTApp_Login") {
                            clearSession();
                            alert($.i18n.prop("common.Routerdeviceinuse"));
                            return;
                        }
                        if (obj.Result == "SUCCESS") {

                            alert($.i18n.prop("success.message"));
                            location.reload();
                        } else {
                            alert(obj.Result);
                            return;
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.LoadingOverlay("hide");
                        clearSession();
                        //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                    }
                });
            }
            else
            {
                alert($.i18n.prop("home.MACAddress") + '1' + $.i18n.prop("error.macaddressformat"))
                $("#macid1").focus();                    
            }
        }
    }
}

function EditMACAddressFilterMAC() {
    $("#openUpdateConfirmMACAddressModal").modal("hide");
    var mac1address = '';
    var fullregexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    var regexp = /[A-Fa-f0-9]{2}/i;
    var flag = true;
    var OLD_MACList = $("#OLD_MACList").val().toLowerCase();
    var OLD_MAC = $("#OLD_MAC").val().toLowerCase();
    $('input[name^=edit_mac1]').each(function () {
        if ($(this).val()) {
            if (!regexp.test($(this).val())) {
                alert($.i18n.prop("home.MACAddress") + $.i18n.prop("error.macaddressformat"))
                //alert('invalid format')
                $(this).focus();
                flag = false;
                return false;
            } else {
                mac1address += $(this).val() + ':';
            }
        } else {
            alert($.i18n.prop("error.Field_Empty"))
            //alert('not be empty');
            $(this).focus();
            flag = false;
            return false;
        }

    });

    if (flag) {
        var flag1 = true;
        var MACList = '';
        var desc1 = '';
        var MACNo = $("#editMacID").val();
        mac1address = mac1address.substring(0, mac1address.length - 1);

        if (mac1address != '') {
            var find1 = OLD_MACList.search(mac1address.toLowerCase());
            if (!fullregexp.test(mac1address)) {
                alert($.i18n.prop("home.MACAddress") + $.i18n.prop("error.macaddressformat"))
                flag1 = false;
            }
            else if(find1 != "-1") 
            {
                if(OLD_MAC == mac1address.toLowerCase()) 
                {
                    if (checkNameStringType3('edit_description', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                        desc1 = $("#edit_description").val();
                        desc1 = strReplace(desc1);
                        flag1 = true;
                        MACList = mac1address;
                    } else {
                        flag1 = false;
                    }                 
                }
                else
                {
                    alert($.i18n.prop("error.macaddressduplicated"))
                    flag1 = false;   
                }        
            }             
            else 
            {
                if (checkNameStringType3('edit_description', 1, 32, $.i18n.prop("lan.wifi.mac.filter.Desc"))) {
                    desc1 = $("#edit_description").val();
                    desc1 = strReplace(desc1);
                    flag1 = true;
                    MACList = mac1address;
                } else {
                    flag1 = false;
                }
            }
        }

        //MACList = MACList.substring(0, MACList.length - 1);
        //flag1 = false;
        if (flag1) {
            $.LoadingOverlay("show");
            $.ajax({
                type: "POST",
                url: "../../cgi-bin/qcmap_web_cgi",
                data: {
                    Page: "EditMACAddressFilterMAC",
                    MACNo: MACNo,
                    MAC: MACList,
                    Description: desc1,
                    token: session_token
                },
                dataType: "text",
                success: function (msgs) {
                    $.LoadingOverlay("hide");
                    var obj = jQuery.parseJSON(msgs);
                    if (obj.result == "AUTH_FAIL") {
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                    }
                    if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                    }
                    if (obj.commit == "Socket Send Error") {
                        clearSession();
                        alert($.i18n.prop("error.SocketSendError"));
                        return;
                    }
                    if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                    }
                    if (obj.Result == "SUCCESS") {
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    } else {
                        alert(obj.Result);
                        return;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    //$.LoadingOverlay("hide");
                    clearSession();
                    //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                }
            });
        }

    }
}

function strReplace(str) {
    var newStr = '';
    if (str) {
        var myStr = str;
        newStr = myStr.replace(/\|/g, "[][]");
        newStr = newStr.replace(/,/g, "<><>");
    }
    return newStr;
}

function strReplaceReturn(str) {
    var newStr = '';
    if (str) {
        var myStr = str;
        newStr = myStr.replace(/\[\]\[\]/g, "|");
        newStr = newStr.replace(/<><>/g, ",");
    }
    return newStr;
}

function EditConnectClient_check() {

    if (!checkNameStringType1("edit_hostname", 1, 64, $.i18n.prop("client.list.HostName"))) {
        return false;
    } else {
        return true;
    }

}

function ConfirmSetMACAddressFilter() {
    $('#addMacAddress').modal('show');
}

function GetMACAddressFilterMACList() {
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetMACAddressFilterMACList",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var s = msgs.replace(/[\x00-\x1F\x7F-\x9F]/g,"") //remove control characters
            var obj = jQuery.parseJSON(s);  
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                $("#OLD_MACList").val(obj.MACList);
                var macaddress = obj.MACList;
                //macaddress = 'id1|11:11:11:11:11|desc1,id2|22:22:22:22:22|desc2';
                var tempArray, subtempArray;
                if (macaddress != "") {
                    tempArray = macaddress.split(",");
                    $("#macAmount").val(tempArray.length);
                    for (i = 0; i < tempArray.length; i++) {
                        subtempArray = tempArray[i].split("|");
                        subid = subtempArray[0];
                        subaddress = subtempArray[1];
                        subdesc = strReplaceReturn(subtempArray[2]);

                        card += '<div class="col-12 col-md-12 col-lg-12 text-center mb-2">' +
                            '<div class="flex">' +
                            '<div class="item flex-2 ">' +
                            '<div class="row flex-item-center">' +
                            '<div class="col-12 col-sm-3 col-md-3 col-lg-3">' +
                            '<img class="card-image-2" alt="image" src="assets/img/5g_content/card_image_mac_address.svg">' +
                            '</div>' +
                            '<div class="text-left col-12 col-sm-3 col-md-5 col-lg-5">' +
                            '<small class="card-title-font"><span data-locale="lan.wifi.mac.filter.Desc">' + $.i18n.prop("lan.wifi.mac.filter.Desc") + '</span></small><dt class="card-empty-font" id="editdescdisplay' + subid + '">' + subdesc + '</dt>' +
                            '</div>' +
                            '<div class="text-left col-12 col-sm-4 col-md-4 col-lg-4">' +
                            '<small class="card-title-font"><span data-locale="lan.wifi.mac.filter.MACAddress">' + $.i18n.prop("lan.wifi.mac.filter.MACAddress") + '</span></small><dt class="card-empty-font" id="editaddressdisplay' + subid + '">' + subaddress + '</dt>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="item ">' +
                            '<div class="row flex-item-center ">' +
                            '<div class="col-12 col-md-12 col-lg-12 col-sm-12">' +
                            '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmDeleteMacaddress(\'' + subid + '\')"><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>'+
                            '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmEditMacaddress(\'' + subid + '\')"><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }
                }else {
                    $("#macAmount").val(0);
                }
                if (card != '') {
                    $("#card").html(card);
                }

                //KittyLock
                findKittyKey('MacAddressFiltering', 'Select_MacFilter');
                findKittyKey('MacAddressFiltering', 'addMacAddress_kitty');
                findKittyKey('MacAddressFiltering', 'applyMACDisconnectModal_kitty');
                findKittyKeyClass('MacAddressFiltering', 'kitty_lock');                
            } else {
                alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetWPSEnable(enable) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    //var WPS_Type = $("#Select_WPS_Type").val();
    var WPS_Type = 0;
    var WPS_PIN_Code = '';
    var flag = 1;
    // if (WPS_Type == 1) {
    //   flag = ValidateInputLength("WPS_PIN_Code", 4, 8);
    // }
    var WPS_On_Off = enable;

    var form = {
        Page: "SetWPSEnable",
        WPS_Type: WPS_Type,
        WPS_PIN_Code: WPS_PIN_Code,
        WPS_On_Off: WPS_On_Off,
        token: session_token
    };
   
    if (flag) {                 
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetBasicWifiAPConfig",
                mask: "0",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return ;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return ;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return ;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return ;
                }
                if (obj.Wifi_Basic_Result == "SUCCESS") {

                    var SSID_A_Name = obj.SSID_A_Name;
                    var SSID_A_Security = obj.SSID_A_Security;
                    var SSID_A_Password = obj.SSID_A_Password;
                    var SSID_A_Stealth = obj.SSID_A_Stealth;
                    var SSID_A_Privacy = obj.SSID_A_Privacy;
                    var SSID_A_Max_Client = obj.SSID_A_Max_Client;
                    var SSID_B_Name = obj.SSID_B_Name;
                    var SSID_B_Status = obj.SSID_B_Status;
                    var SSID_B_Security = obj.SSID_B_Security;
                    var SSID_B_Password = obj.SSID_B_Password;
                    var SSID_B_Stealth = obj.SSID_B_Stealth;
                    var SSID_B_Privacy = obj.SSID_B_Privacy;
                    var SSID_B_Max_Client = obj.SSID_B_Max_Client;
                    var SSID_B_AccessWeb = obj.SSID_B_AccessWeb;
                    var SSID_A_PMF = obj.SSID_A_PMF;
                    var SSID_B_PMF = obj.SSID_B_PMF;

                    if(SSID_A_Stealth == "1")
                    {
                        alert($.i18n.prop("error.wps_stealth"));
                        return ;
                    } 
                    else if(SSID_A_Security != '1' && SSID_A_Security != '2' && SSID_A_Security != '4')
                    {
                        alert($.i18n.prop("error.wps_wpa2"));
                        return ;                    
                    }  
                    else
                    {
                        $.LoadingOverlay("show");
                        $.ajax({
                            type: "POST",
                            url: "../../cgi-bin/qcmap_web_cgi",
                            data: {
                                Page: "SetWPSEnable",
                                WPS_Type: WPS_Type,
                                WPS_PIN_Code: WPS_PIN_Code,
                                WPS_On_Off: WPS_On_Off,
                                token: session_token
                            },
                            dataType: "text",
                            success: function (msgs) {
                                $.LoadingOverlay("hide");
                                var obj = jQuery.parseJSON(msgs);
                                if (obj.result == "AUTH_FAIL") {
                                    clearSession();
                                    alert($.i18n.prop("error.AUTH_FAIL"));
                                    return;
                                }
                                if (obj.result == "Token_mismatch") {
                                    clearSession();
                                    alert($.i18n.prop("error.Token_mismatch"));
                                    return;
                                }
                                if (obj.commit == "Socket Send Error") {
                                    clearSession();
                                    alert($.i18n.prop("error.SocketSendError"));
                                    return;
                                }
                                if (obj.result == "QTApp_Login") {
                                    clearSession();
                                    alert($.i18n.prop("common.Routerdeviceinuse"));
                                    return;
                                }
                                if (obj.WPS_Enable_Result == "SUCCESS") {
                                    if (WPS_On_Off == 1) {
                                        alert($.i18n.prop("success.message"));
                                        $("#wps_start").hide();
                                        $("#wps_stop").show();
                                        $("#status").html('<span data-locale="body.WPSStatusProcess">'+ $.i18n.prop("body.WPSStatusProcess") +'</span>');

                                        var WPSidleInterval = self.setInterval("WPSTimerIncrement()", 1000); // 1 sec                
                                    } else {
                                        location.reload();
                                    }

                                } else if(obj.WPS_Enable_Result == "WIFI OFF") {
                                    alert($.i18n.prop("error.wps_wifioff"));       
                                    return;
                                }
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                //$.LoadingOverlay("hide");
                                clearSession();
                                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                            }
                        });
                    }  
                } 
            },
            error: function (xhr, textStatus, errorThrown) {
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });                      
    }
}

function ConfirmEditMacaddress(id) {
    var desc = $("#editdescdisplay" + id).text();
    var address = $("#editaddressdisplay" + id).text();
    var temp = address.split(':');
    $("#editMacID").val(id);
    $("#mac_p1").val(temp[0]);
    $("#mac_p2").val(temp[1]);
    $("#mac_p3").val(temp[2]);
    $("#mac_p4").val(temp[3]);
    $("#mac_p5").val(temp[4]);
    $("#mac_p6").val(temp[5]);
    $("#edit_description").val(desc);
    $("#OLD_MAC").val(address);
    $("#editMacAddress").modal("show");
}

function ConfirmDeleteMacaddress(id) {
    //var desc = $("#editdescdisplay"+id).text();
    var address = $("#editaddressdisplay" + id).text();
    $("#deleteMacID").val(id);
    $("#deleteMac").text(address);
    $("#confirmDeleteMacaddress").modal("show");
}

function deleteMacAddressAction() {
    //check if the latest record, MAC Address Filter should be disabled   
    if($("#macAmount").val()=="1" ) {
    // if($("#macAmount").val()=="1" && $("#Select_MacFilter").val()=="1") {
        DeleteLastMacaddress();
    }else {
        DeleteMacaddress();
    }
}

function DeleteMacaddress() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var deleteMacID = $("#deleteMacID").val();
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "DeleteMACAddressFilterMAC",
            MACNo: deleteMacID,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                alert($.i18n.prop("success.message"));
                location.reload();               
            } else {
                alert(obj.Result);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function DeleteLastMacaddress() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var deleteMacID = $("#deleteMacID").val();
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetMACAddressFilterOnOff",
            Enable: 0,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            //$.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_web_cgi",
                    data: {
                        Page: "DeleteMACAddressFilterMAC",
                        MACNo: deleteMacID,
                        token: session_token
                    },
                    dataType: "text",
                    success: function (msgs) {
                        $.LoadingOverlay("hide");
                        var obj = jQuery.parseJSON(msgs);
                        if (obj.result == "AUTH_FAIL") {
                            //clearSession();
                            clearSession();
                            alert($.i18n.prop("error.AUTH_FAIL"));
                            return;
                        }
                        if (obj.result == "Token_mismatch") {
                            clearSession();
                            alert($.i18n.prop("error.Token_mismatch"));
                            return;
                        }
                        if (obj.commit == "Socket Send Error") {
                            clearSession();
                            alert($.i18n.prop("error.SocketSendError"));
                            return;
                        }
                        if (obj.result == "QTApp_Login") {
                            clearSession();
                            alert($.i18n.prop("common.Routerdeviceinuse"));
                            return;
                        }
                        if (obj.Result == "SUCCESS") {
                            alert($.i18n.prop("success.message"));
                            location.reload();                            
                        } else {
                            alert(obj.Result);
                            return;
                        } 
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.LoadingOverlay("hide");
                        clearSession();
                        //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                    }
                });

            } else {
                alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
    
}

function GetMACAddressFilterOnOff(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetMACAddressFilterOnOff",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                var Enable = obj.Enable;

                switch (String(Enable)) {
                    case "1":
                        $("#Select_MacFilter option[value='1']").prop('selected', true);
                        $("#MacAddress_status").html('<span data-locale="common.Enabled">'+ $.i18n.prop("common.Enabled") +'</span>');
                        break;
                    case "0":
                        $("#Select_MacFilter option[value='0']").prop('selected', true);
                        $("#MacAddress_status").html('<span data-locale="common.Disabled">'+ $.i18n.prop("common.Disabled") +'</span>');                        
                        break;
                }
                if (callFunc1) {
                    callFunc1();
                }

            } else {
                alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function openMacONOFFConfirmModal() {
    var Enable = $("#Select_MacFilter").val();
    var macAmount = $("#macAmount").val();

    if(Enable=="1" && macAmount=="0") {
        alert($.i18n.prop("error.NoneoftheMACaddresses"));
        $("#Select_MacFilter option[value='0']").prop('selected', true);
    }else {
        $("#applyMACDisconnectModal").modal("show");
    }

}

function SetMACAddressFilterOnOff() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    
    var Enable = $("#Select_MacFilter").val();

        $.LoadingOverlay("show");

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetMACAddressFilterOnOff",
                Enable: Enable,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                } else {
                    alert(obj.Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    
}

function SetMACAddressFilterOnOffAutoOff() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "SetMACAddressFilterOnOff",
            Enable: 0,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                //location.reload();

            } else {
                alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function WiFiFactoryReset() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "WiFiFactoryReset",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Set_Wifi_Default_Result == "SUCCESS") {

                alert($.i18n.prop("success.message"));
                location.reload();

            } else {
                alert(obj.Set_Wifi_Default_Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function isZip(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'zip':
    case 'ZIP':
        // etc
        return true;
    }
    return false;
}

function software_upload() {

    $("#software_upload_form").trigger('submit');

}

// $('#software_upload_form').submit(function (e) {
//     e.preventDefault();
//     var file_data = $("#upload_file").prop('files')[0];
//     if (!file_data) {
//         alert($.i18n.prop("error.zipnotfound"));
//         $("#confirmStartToUpload").modal('hide');
//         $("#upload_name").text('');
//     } else {
//         var filesize = file_data.size + 10485760; //bytes + buffer 10M
//         var Space = $("#Space").val() * 1048576; //bytes
//         var filename = file_data.name;
//         var last3 = filename.substr(filename.length - 3);
//         if(last3 != "zip" && last3 !="ZIP")
//         {
//             alert($.i18n.prop("error.zipformat"));
//             $("#confirmStartToUpload").modal('hide');
//             $("#upload_name").text('');
//         }
//         // else if(filesize >= Space)
//         // {
//         //     alert($.i18n.prop("error.space"));
//         //     $("#confirmStartToUpload").modal('hide');
//         //     $("#upload_name").text('');
//         // }
//         else
//         {    

//             // check battery >= 30%
//             $.LoadingOverlay("show");
//             $.ajax({
//                 type: "POST",
//                 url: "../../cgi-bin/qcmap_web_cgi",
//                 data: {
//                     Page: "GetHomeDeviceInfo",
//                     mask: "0",
//                     token: session_token
//                 },
//                 dataType: "text",
//                 success: function (msgs) {
//                     if (msgs.length > 0) {
//                         var obj = jQuery.parseJSON(msgs);
//                         if(parseInt(obj.BatteryCapacity) >= 30)
//                         {
//                             var form_data = new FormData();
//                             form_data.append('file', file_data);
//                             form_data.append('fname', "update.zip");
//                             form_data.append('fpath', "/data/www/");
//                             form_data.append('remainingSpaceMB', 10);
//                             $.LoadingOverlay("show");
//                             $.ajax({
//                                 type: "POST",
//                                 url: "../../cgi-bin/qcmap_web_upload",
//                                 data: form_data,
//                                 contentType: false,
//                                 cache: false,
//                                 processData: false,
//                                 dataType: "text",
//                                 success: function (msgs) {
//                                     var obj = jQuery.parseJSON(msgs);
                                    
//                                     switch (obj.Result) {
//                                         case "SUCCESS":
//                                             var filepath = '/data/www/update.zip';
//                                             //alert('upload success')
//                                             LocalUpgradeSoftware(filepath);
//                                             break;
//                                         case "FILE_NOTFOUND_FAIL":
//                                             $.LoadingOverlay("hide");
//                                             alert($.i18n.prop("error.zipnotfound"));
//                                             $("#confirmStartToUpload").modal('hide');
//                                             $("#upload_name").text('');
//                                             //alert('zip files are not found')
//                                             break;
//                                         case "FILE_PATH_FAIL":
//                                             $.LoadingOverlay("hide");
//                                             alert($.i18n.prop("error.zipnotfound"));
//                                             $("#confirmStartToUpload").modal('hide');
//                                             $("#upload_name").text('');
//                                             //alert('zip files path are not found')
//                                             break;
//                                         case "FILE_FORMAT_FAIL":
//                                             $.LoadingOverlay("hide");
//                                             alert($.i18n.prop("error.zipformat"));
//                                             $("#confirmStartToUpload").modal('hide');
//                                             $("#upload_name").text('');
//                                             //alert('zip files are only allowed')
//                                             break;
//                                         case "FILE_SIZE_FAIL":
//                                             $.LoadingOverlay("hide");
//                                             alert($.i18n.prop("error.filesize"));
//                                             $("#confirmStartToUpload").modal('hide');
//                                             $("#upload_name").text('');
//                                             //alert('size should be less than 2MB')
//                                             break;
//                                         case "FILE_OPEN_FILE_FAIL":
//                                             $.LoadingOverlay("hide");
//                                             alert($.i18n.prop("error.zipformat"));
//                                             $("#confirmStartToUpload").modal('hide');
//                                             $("#upload_name").text('');
//                                             //alert('FILE_FAIL')
//                                             break;
//                                         default:
//                                             $.LoadingOverlay("hide");
//                                             alert($.i18n.prop("error.zipformat"));
//                                             $("#confirmStartToUpload").modal('hide');
//                                             $("#upload_name").text('');
//                                             //alert('system error')
//                                             break;
//                                     }
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             alert($.i18n.prop("error.softwarebatteryless30"));
//                             $("#confirmStartToUpload").modal('hide');
//                             $("#upload_name").text('');                            
//                             return false;                    
//                         }
//                     }
//                 }
//             });    
//         }
//     }
// });

$('#software_upload_form').submit(function (e) {
    e.preventDefault();
    var file_data = $("#upload_file").prop('files')[0];
    if (!file_data) {
        alert($.i18n.prop("error.zipnotfound"));
        $("#confirmStartToUpload").modal('hide');
        $("#upload_name").text('');
    } else {
        var filesize = file_data.size + 10485760; //bytes + buffer 10M
        //var Space = $("#Space").val() * 1048576; //bytes
        var filename = file_data.name;
        var last3 = filename.substr(filename.length - 3);
        if(last3 != "zip" && last3 !="ZIP")
        {
            alert($.i18n.prop("error.zipformat"));
            $("#confirmStartToUpload").modal('hide');
            $("#upload_name").text('');
        }
        // else if(filesize >= Space)
        // {
        //     alert($.i18n.prop("error.space"));
        //     $("#confirmStartToUpload").modal('hide');
        //     $("#upload_name").text('');
        // }
        else
        {    
            $.LoadingOverlay("show");


                            //if file is large, release memory
                            // if(filesize >= 10485760)
                            // {
                            //     $.ajax({
                            //         type: "POST",
                            //         url: "../../cgi-bin/qcmap_web_cgi",
                            //         data: {
                            //             Page: "FreeDeviceMemory",
                            //             mask: "0",
                            //             token: session_token
                            //         },
                            //         dataType: "text",
                            //         success: function (msgs) {
                            //             $.LoadingOverlay("hide");
                            //             if (msgs.length > 0) {    
                            //                 var obj = jQuery.parseJSON(msgs);
                            //                 switch (obj.Result) {
                            //                     case "SUCCESS":
                            //                         var Space = obj.Space * 1048576;
                            //                         if(filesize >= Space)
                            //                         {
                            //                             alert($.i18n.prop("error.space"));
                            //                             $("#confirmStartToUpload").modal('hide');
                            //                             $("#upload_name").text('');
                            //                         }
                            //                         else
                            //                         {
                            //                             var form_data = new FormData();
                            //                             form_data.append('file', file_data);
                            //                             form_data.append('fname', "update.zip");
                            //                             form_data.append('fpath', "/data/www/");
                            //                             form_data.append('remainingSpaceMB', 10);
                                                       
                            //                             //progress bar show
                            //                             GetDownloadLocalProgressModal();
                            //                             $.ajax({
                            //                                 type: "POST",
                            //                                 url: "../../cgi-bin/qcmap_web_upload?X-Progress-ID=a2345678901234567890123456789012",
                            //                                 data: form_data,
                            //                                 contentType: false,
                            //                                 cache: false,
                            //                                 processData: false,
                            //                                 dataType: "text",
                            //                                 success: function (msgs) {
                            //                                     var obj = jQuery.parseJSON(msgs);
                                                                
                            //                                     switch (obj.Result) {
                            //                                         case "SUCCESS":
                            //                                             var filepath = '/data/www/update.zip';
                            //                                             //alert('upload success')
                            //                                             LocalUpgradeSoftware(filepath);
                            //                                             break;
                            //                                         case "FILE_NOTFOUND_FAIL":
                            //                                             //$.LoadingOverlay("hide");
                            //                                             alert($.i18n.prop("error.zipnotfound"));
                            //                                             $("#confirmStartToUpload").modal('hide');
                            //                                             $("#upload_name").text('');
                            //                                             //alert('zip files are not found')
                            //                                             break;
                            //                                         case "FILE_PATH_FAIL":
                            //                                             //$.LoadingOverlay("hide");
                            //                                             alert($.i18n.prop("error.zipnotfound"));
                            //                                             $("#confirmStartToUpload").modal('hide');
                            //                                             $("#upload_name").text('');
                            //                                             //alert('zip files path are not found')
                            //                                             break;
                            //                                         case "FILE_FORMAT_FAIL":
                            //                                             //$.LoadingOverlay("hide");
                            //                                             alert($.i18n.prop("error.zipformat"));
                            //                                             $("#confirmStartToUpload").modal('hide');
                            //                                             $("#upload_name").text('');
                            //                                             //alert('zip files are only allowed')
                            //                                             break;
                            //                                         case "FILE_SIZE_FAIL":
                            //                                             //$.LoadingOverlay("hide");
                            //                                             alert($.i18n.prop("error.filesize"));
                            //                                             $("#confirmStartToUpload").modal('hide');
                            //                                             $("#upload_name").text('');
                            //                                             //alert('size should be less than 2MB')
                            //                                             break;
                            //                                         case "FILE_OPEN_FILE_FAIL":
                            //                                             //$.LoadingOverlay("hide");
                            //                                             alert($.i18n.prop("error.zipformat"));
                            //                                             $("#confirmStartToUpload").modal('hide');
                            //                                             $("#upload_name").text('');
                            //                                             //alert('FILE_FAIL')
                            //                                             break;
                            //                                         default:
                            //                                             //$.LoadingOverlay("hide");
                            //                                             alert($.i18n.prop("error.zipformat"));
                            //                                             $("#confirmStartToUpload").modal('hide');
                            //                                             $("#upload_name").text('');
                            //                                             //alert('system error')
                            //                                             break;
                            //                                     }
                            //                                 }
                            //                             });                                                        
                            //                         }


                            //                     break;

                            //                 }
                            //             }   
                            //         }      
                            //     });                   
                            // }
                            // else
                            // {
                                var form_data = new FormData();
                                form_data.append('file', file_data);
                                form_data.append('fname', "update.zip");
                                form_data.append('fpath', "/data/www/");
                                form_data.append('remainingSpaceMB', 10);
                                $.LoadingOverlay("hide");
                                //progress bar show
                                GetDownloadLocalProgressModal();                                
                                $.ajax({
                                    type: "POST",
                                    url: "../../cgi-bin/qcmap_web_upload?X-Progress-ID=a2345678901234567890123456789012",
                                    data: form_data,
                                    contentType: false,
                                    cache: false,
                                    processData: false,
                                    dataType: "text",
                                    success: function (msgs) {
                                        var obj = jQuery.parseJSON(msgs);
                                        
                                        switch (obj.Result) {
                                            case "SUCCESS":
                                                var filepath = '/data/www/update.zip';
                                                //alert('upload success')
                                                LocalUpgradeSoftware(filepath);
                                                break;
                                            case "FILE_NOTFOUND_FAIL":
                                                //$.LoadingOverlay("hide");
                                                alert($.i18n.prop("error.zipnotfound"));
                                                $("#confirmStartToUpload").modal('hide');
                                                $("#upload_name").text('');
                                                //alert('zip files are not found')
                                                break;
                                            case "FILE_PATH_FAIL":
                                                //$.LoadingOverlay("hide");
                                                alert($.i18n.prop("error.zipnotfound"));
                                                $("#confirmStartToUpload").modal('hide');
                                                $("#upload_name").text('');
                                                //alert('zip files path are not found')
                                                break;
                                            case "FILE_FORMAT_FAIL":
                                                //$.LoadingOverlay("hide");
                                                alert($.i18n.prop("error.zipformat"));
                                                $("#confirmStartToUpload").modal('hide');
                                                $("#upload_name").text('');
                                                //alert('zip files are only allowed')
                                                break;
                                            case "FILE_SIZE_FAIL":
                                                //$.LoadingOverlay("hide");
                                                alert($.i18n.prop("error.filesize"));
                                                $("#confirmStartToUpload").modal('hide');
                                                $("#upload_name").text('');
                                                //alert('size should be less than 2MB')
                                                break;
                                            case "FILE_OPEN_FILE_FAIL":
                                                //$.LoadingOverlay("hide");
                                                alert($.i18n.prop("error.zipformat"));
                                                $("#confirmStartToUpload").modal('hide');
                                                $("#upload_name").text('');
                                                //alert('FILE_FAIL')
                                                break;
                                            default:
                                                //$.LoadingOverlay("hide");
                                                alert($.i18n.prop("error.zipformat"));
                                                $("#confirmStartToUpload").modal('hide');
                                                $("#upload_name").text('');
                                                //alert('system error')
                                                break;
                                        }
                                    }
                                });
                            // }  
        }
    }
});

function LocalUpgradeSoftware(Path) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var flag = true;
    if (flag) {
        //$.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "LocalUpgradeSoftware",
                Path: Path,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    //RebootDevice();
                    //alert($.i18n.prop("success.message"));
                    //clearSession();
                    SessionIdleInterval = self.setInterval("sessionCheckToServer()", 5000); // 5 seconds check again
                    //location.reload();
                } else {
                    alert($.i18n.prop("softwareUpdate.LocalUpdate") + $.i18n.prop("error.isinvalid"));
                    location.reload();
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetUpdateSoftware() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var SignalStatus = localStorage.getItem("SignalStatus") ? localStorage.getItem("SignalStatus") : '';

    if (SignalStatus == "2") {
        //roaming
        alert($.i18n.prop("error.otaroaming"));                   
    }else {
        $.LoadingOverlay("show");

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetUpdateSoftware",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$("#checkingNewVersion").modal("hide");
                //$("#NoNewVersion").modal("hide");
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);

                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                    var Available = obj.Available;
                    var Version = obj.Version;
                    var displayDate = obj.Date;
                    if (Available == "1") // has new version
                    {
                        $("#version").text(Version);
                        $("#date").text(displayDate);
                        $("#HasNewVersion").modal("show");
                    } else {
                        alert($.i18n.prop("softwareUpdate.NoNewVersion"));
                        // $("#NoNewVersion").modal("show");
                    }

                } else {
                    alert(obj.Result);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });                     
    } 
}


// function GetRoamingStatus() {
//     var SignalStatus = localStorage.getItem("SignalStatus") ? localStorage.getItem("SignalStatus") : '';
//     var MCC = localStorage.getItem("MCC") ? localStorage.getItem("MCC") : '';
//     //var roaming = obj.roaming;
//     select = $("#Select_channel_2");
//     if(MCC == ""){
//         select.find('option[value="12"]').remove();
//         select.find('option[value="13"]').remove();     
//     }
//     // else if(!checkAllowCountryCode(MCC)){                    
//     //     select.find('option[value="12"]').remove();
//     //     select.find('option[value="13"]').remove();   
//     // }
//     else if (SignalStatus != "1" && SignalStatus != "2") {
//         select.find('option[value="12"]').remove();
//         select.find('option[value="13"]').remove();                              
//     } 
//     $("#roaming").val(SignalStatus);

//     //5g when wifi is on, check service and country code
//     var wifi_status = $("#wifi_status").val();
//     if(wifi_status=="1")
//     {
//         if(MCC == ""){
//             //no service
//             $("#Select_Mode option[value='a']").prop('disabled', true);  
//             $("#Select_Mode option[value='a']").css("color", "#CFD6DE");   
//             alert($.i18n.prop("error.noservice"));      
//         }
//         // else if(!checkAllowCountryCode(MCC)){                 
//         //     //no service
//         //     $("#Select_Mode option[value='a']").prop('disabled', true);  
//         //     $("#Select_Mode option[value='a']").css("color", "#CFD6DE");                                  
//         //     alert($.i18n.prop("error.notinjapan"));
//         // }
//         else if (SignalStatus != "1" && SignalStatus != "2") {
//             //no service
//             $("#Select_Mode option[value='a']").prop('disabled', true);    
//             $("#Select_Mode option[value='a']").css("color", "#CFD6DE");   
//             alert($.i18n.prop("error.noservice"));                            
//         } 
//     }    
// }


function DownloadUpgradeSoftware() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "UpgradeOTASoftware",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }                            
            if (obj.Result == "SUCCESS") {
                //UpgradeOTASoftware();
                $.LoadingOverlay("show");
                SessionIdleInterval = self.setInterval("sessionCheckToServer()", 5000); // 5 seconds check again                               
            } else {
                $.LoadingOverlay("show");
                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_web_cgi",
                    data: {
                        Page: "DownloadOTASoftware",
                        token: session_token
                    },
                    dataType: "text",
                    success: function (msgs) {
                        $.LoadingOverlay("hide");
                        var obj = jQuery.parseJSON(msgs);
                        if (obj.result == "AUTH_FAIL") {
                            //clearSession();
                            clearSession();
                            alert($.i18n.prop("error.AUTH_FAIL"));
                            return;
                        }
                        if (obj.result == "Token_mismatch") {
                            clearSession();
                            alert($.i18n.prop("error.Token_mismatch"));
                            return;
                        }
                        if (obj.commit == "Socket Send Error") {
                            clearSession();
                            alert($.i18n.prop("error.SocketSendError"));
                            return;
                        }
                        if (obj.result == "QTApp_Login") {
                            clearSession();
                            alert($.i18n.prop("common.Routerdeviceinuse"));
                            return;
                        }
                        if (obj.Result == "SUCCESS") {
                            // progress bar show
                            $(".downloading_icon").show();
                            GetDownloadOTAProgressModal();
                        }else if(obj.Result=="DOWNLOAD FAIL") {                         
                            alert($.i18n.prop("error.SoftwareUpdatefailure"));
                            return;                            
                        }else {
                            alert($.i18n.prop("error.downloading"));
                            return;
                        }
                    }
                });
            }                            
        }
    });
}


function GetDownloadOTAProgressModal() {
    DownloadOTAProgressInterval = self.setInterval("GetDownloadOTAProgress()", 3000); // 1 sec   
    $("#DownloadOTAProgress").modal("show");
}

function GetDownloadLocalProgressModal() {
    $('#local_progress').attr('style', 'width:0%;');
    DownloadLocalProgressInterval = self.setInterval("GetDownloaLocalProgress()", 3000); // 1 sec   
    $("#DownloadLocalProgress").modal("show");
}

function CheckOTASoftwareStop() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var flag = true;
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "CheckOTASoftwareStop",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                $("#HasNewVersion").modal('hide');
            }
        });
    }

}

function DownloadOTASoftwareStop() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var flag = true;
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "DownloadOTASoftwareStop",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                DownloadOTAProgressInterval = window.clearInterval(DownloadOTAProgressInterval);
                $("#DownloadOTAProgress").modal('hide');
            }
        });
    }

}

function GetDownloadOTAProgress() {

    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var flag = true;
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetDownloadOTAProgress",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    // alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    if (obj.Progress == '100') {
                        $(".downloading_icon").hide();
                        DownloadOTAProgressInterval = window.clearInterval(DownloadOTAProgressInterval);
                        UpgradeOTASoftware();
                    }
                    else if (obj.Progress == '999') {
                        alert($.i18n.prop("error.networkdisconnected"));
                        location.reload();
                    }
                    else {
                        $('#ota_progress').attr('style', 'width: ' + obj.Progress + '%;');
                    }
                }
            }
        });
    }

}

function UpgradeOTASoftware() {
    $.LoadingOverlay("show");
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var _session_token = session_token;
    //clearClientSessionNoJump();
    var flag = true;
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "UpgradeOTASoftware",
                token: _session_token
            },
            dataType: "text",
            success: function (msgs) {
                SessionIdleInterval = self.setInterval("sessionCheckToServer()", 5000); // 5 seconds check again
            }
        });
    }

}

function ConfirmAddtoAllow(MACList) {
    $("#allow_macaddress").text(MACList)
    $("#ConfirmAddtoAllow").modal("show");
}


// function AddtoAllow() {
//     var MACList = $("#allow_macaddress").text();
//     MACList = MACList + '|'+ $.i18n.prop("lan.wifi.mac.filter.AddFromConnectedClients");
//     $.LoadingOverlay("show");
//     $.ajax({
//         type: "POST",
//         url: "../../cgi-bin/qcmap_web_cgi",
//         data: {
//             Page: "AddMACAddressFilterMACList",
//             MACList: MACList,
//             token: session_token
//         },
//         dataType: "text",
//         success: function (msgs) {
//             $.LoadingOverlay("hide");
//             var obj = jQuery.parseJSON(msgs);
//             if (obj.result == "AUTH_FAIL") {
//                 clearSession();
//                 alert($.i18n.prop("error.AUTH_FAIL"));
//                 return;
//             }
//             if (obj.result == "Token_mismatch") {
//                 clearSession();
//                 alert($.i18n.prop("error.Token_mismatch"));
//                 return;
//             }
//             if (obj.commit == "Socket Send Error") {
//                 clearSession();
//                 alert($.i18n.prop("error.SocketSendError"));
//                 return;
//             }
//             if (obj.result == "QTApp_Login") {
//                 clearSession();
//                 alert($.i18n.prop("common.Routerdeviceinuse"));
//                 return;
//             }
//             if (obj.Result == "SUCCESS") {

//                 alert($.i18n.prop("success.message"));
//                 location.reload();
//             } else {
//                 alert(obj.Result);
//                 return;
//             }
//         },
//         error: function (xhr, textStatus, errorThrown) {
//             //$.LoadingOverlay("hide");
//             clearSession();
//             //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
//         }
//     });



// }


function DMZ_check() {

    if (!ValidateInputValue("Text_DMZ_IP_3", 0, 255, $.i18n.prop("body.DMZSettingsIPAddressLabel"))) {
        return false;
    } else if (!ValidateInputValue("Text_DMZ_IP_4", 0, 255, $.i18n.prop("body.DMZSettingsIPAddressLabel"))) {
        return false;
    } else {
        return true;
    }

}

function GetNativeAppStatus() {
    //$("#loginmodal").modal("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetNativeAppStatus",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //hide_menu();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    //hide_menu();
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    var status = obj.Status;
                    switch (String(status)) {
                        case "0": //Exit
                            $("#password").val('');
                            $("#login-form").validate().resetForm();
                            $("#loginmodal").modal("show");
                            break;
                        case "1": //No use
                        $("#login-form").validate().resetForm();
                            $("#password").val('');
                            $("#loginmodal").modal("show");
                            break;
                        case "2": //Logout
                        $("#login-form").validate().resetForm();
                            $("#password").val('');
                            $("#loginmodal").modal("show");
                            break;
                        case "3": // Login
                            $("#routerinuse").modal("show");
                            break;
                    }
                }
            }
        }
        // error: function(xhr, textStatus, errorThrown)
        // {
        //  alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        // }
    });
}

function GetAboutPlatformInfoSoftware(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAboutPlatformInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            var firmware_version = obj.model + '_' + obj.major + '_' + obj.minor;
            $("#software_version").text(firmware_version);
            if (callFunc1) {
                callFunc1();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function getChangePassword() {
    findKittyKey('NewPassword01', 'updatePassword');
}

function findKittyKey(key, id, action) {
    if (!action) action = 'disabled';

    var unlock_ignore = ['SsidA_WifiPmf', 'SsidB_WifiPmf'];

    for (p = 0; p < Locks.length; p++) {
        if (key == Locks[p].L) {
            switch (Locks[p].P) {
                case "Lock":
                    $("#" + id).prop('disabled', true);
                    break;
                case "Unlock":
                    if (unlock_ignore.indexOf(Locks[p].L) == '-1') {
                        $("#" + id).prop('disabled', false);
                    } else {
                    }
                    break;
            }
            break;
        } else {
            //return false;
        }
    }
}


function findKittyKeyClass(key, id) {

    var unlock_ignore = ['SsidA_WifiPmf', 'SsidB_WifiPmf'];

    for (p = 0; p < Locks.length; p++) {
        if (key == Locks[p].L) {
            switch (Locks[p].P) {
                case "Lock":
                    $("." + id).prop('disabled', true);
                    break;
                case "Unlock":
                    if (unlock_ignore.indexOf(Locks[p].L) == '-1') {
                        $("." + id).prop('disabled', false);
                    } else {
                    }
                    break;
            }
            break;
        } else {
            //return false;
        }
    }    
}

function findAPNKittyKeySlectable(key) {

    for (p = 0; p < Locks.length; p++) {
        if (key == Locks[p].L) {
            switch (Locks[p].P) {
                case "Selectable":
                    $("#ApnProfilesSettings_New").prop('disabled', true);
                    $(".kitty_lock").prop('disabled', true);
                    break;
            }
            break;
        } else {
            //return false;
        }
    }    
}

//accept Japanese characters
// MAC address description
// APN profile name
// APN Username
// APN Password
// Port Mapping rule name
// 

function checkNameStringType1(id, min, max, item_name) {
    // Host name
    // Input value
    // * 1 - 64 characters
    // * alphabet (A-Z and a-z), digits (0-9), hyphen (-) and underscore (_)
    var item = $("#" + id).val();
    var noRe = /^[a-zA-Z0-9_-]+$/;
    var re = noRe.test(item);
    var VALID;

    if (item.length > 0) {
        if (item.length < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))

            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (item.length > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))

            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (!re) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType1"))
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType2(id, min, max, item_name) {
    // APN name
    // Input value w/o pre-set
    // * 1 - 64 characters
    // * alphabet (A-Z and a-z), digits (0-9), period (.) and hyphen (-)
    var item = $("#" + id).val();
    var noRe = /^[a-zA-Z0-9.-]+$/;
    var re = noRe.test(item);
    var VALID;

    if (item.length > 0) {
        if (item.length < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (item.length > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (!re) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType2"))
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType3(id, min, max, item_name) {
    // CPE Port Trigger Rule name,
    // Port Mapping Rule name,
    // Mac Address Description
    // "input value,
    // less than 32 bytes 
    // * alphabet (A-Z and a-z), digits (0-9) and symbols(except for [,], [""], [:], [;], [\], [�ｼ], [&], [%], [+], ['], [<], [>], [?]) and Japanese characters    
    var item = $("#" + id).val();
    // var noRe = /[\,�彌"�彌:�彌;�彌\�彌ﾂ･|\�･�彌&�彌%�彌+�彌'�彌<�彌>�彌?]/;
    var illegalSymbol = /[\,\"\:\;\\\ﾂ･\�･\&\%\+\'\<\>\?]/;
    var illegalSymbolCheck = illegalSymbol.test(item);
    var noRe = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]+$/;
    var re = noRe.test(item);
    
    var VALID;
    var itemBytes = stringToBytes(item);
    var str4;
    switch(max)
    {
        case 32:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;
        case 62:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-2");
        break;   
        case 64:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-3");
        break;  
        default:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;       
    } 
    if (itemBytes > 0) {
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } 
        else if (illegalSymbolCheck) {
            // console.log('illegalSymbolCheck:'+item)
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType3"))
            $("#" + id).focus();
        } 
        else if (!re) {
            // console.log('sss:'+item)
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType3"))
            $("#" + id).focus();
        } 
        else {
            VALID = 1;
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType4(id, min, max, item_name) {
    // CPE SSID_A_Name
    // APN Profile Name
    // "Input value w/o pre-set
    // * 1 - 32 bytes
    // * alphabet (A-Z and a-z), digits (0-9), symbols(All) and Japanese characters
    // "
    var item = $("#" + id).val();
    var VALID;
    var itemBytes = stringToBytes(item);
    var str4;
    // var regex = /^[a-zA-Z0-9~! ,'"&%+<>?@#$^*()_=\-`\[\]{}\\.\/|\x{3000}-\x{303F}\x{3040}-\x{309F}\x{30A0}-\x{30FF}\x{FF00}-\x{FFEF}\x{4E00}-\x{9FAF}\x{2605}-\x{2606}\x{2190}-\x{2195}\x{203B}愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡]+$/;
    // var regex = /^[a-zA-Z0-9~! ,ﾂ･�･:;'"&%+<>?@#$^*()_=\-`\[\]{}\\.\/|\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEFu\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡]+$/; 
    // var regex = /[愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;

    var regex = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]+$/;
    
    // var regex = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEFu\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B]+$/;

    var re = regex.test(item);
    
    switch(max)
    {
        case 32:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;
        case 62:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-2");
        break;   
        case 64:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-3");
        break;  
        default:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;       
    }    
    if (itemBytes > 0) {
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else {
            if(!re) {
                VALID = 0;
                alert(item_name + $.i18n.prop("error.checkNameStringType4"))
                $("#" + id).focus();
            }else {
                VALID = 1;
            }    
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType5(id, min, max, item_name) {
    // APN User name,
    // "Input value w/o pre-set
    // * 1 - 64 bytes
    // * alphabet (A-Z and a-z), digits (0-9), symbols(All) and Japanese characters
    // * ERROR if there is SPACE at the END
    // " Can be empty  
    var item = $("#" + id).val();
    var VALID;
    var itemBytes = stringToBytes(item);
    var regex = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]+$/;
    var re = regex.test(item);

    var str4;
    switch(max)
    {
        case 32:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;
        case 62:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-2");
        break;   
        case 64:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-3");
        break;  
        default:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;       
    }    
    if (itemBytes > 0) {
        var lastChar = item.slice(-1);
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (lastChar == " ") {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.endwithspace"))
            $("#" + id).focus();
        } else if(!re) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType4"))
            $("#" + id).focus();            
        } else {
            VALID = 1;
        }
    } else {
        VALID = 1;
        // alert($.i18n.prop("error.Field_Empty"))
        // $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType6(id, min, max, item_name) {
    // APN Password
    // "Input value w/o pre-set
    // * 1 - 32 bytes
    // * alphabet (A-Z and a-z), digits (0-9), symbols(All) and Japanese characters
    // * ERROR if there is SPACE at the END
    // " Can be empty    
    var item = $("#" + id).val();
    var VALID;
    var itemBytes = stringToBytes(item);
    var str4;
    var regex = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]+$/;
    var re = regex.test(item);

    switch(max)
    {
        case 32:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;
        case 62:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-2");
        break;   
        case 64:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-3");
        break;  
        default:
            str4 = $.i18n.prop("error.enterjp.stringlengthbetween4-1");
        break;       
    }    
    if (itemBytes > 0) {
        var lastChar = item.slice(-1);
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.enterjp.stringlengthbetween1") + item_name + $.i18n.prop("error.enterjp.stringlengthbetween2") + min + $.i18n.prop("error.enterjp.stringlengthbetween3") + max + str4)
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (lastChar == " ") {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.endwithspace"))
            $("#" + id).focus();
        } else if(!re) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType4"))
            $("#" + id).focus();            
        } else {
            VALID = 1;
        }
    } else {
        VALID = 1;
        // alert($.i18n.prop("error.Field_Empty"))
        // $("#" + id).focus();
    }
    return VALID;
}

// function checkNameStringType7(id, min, max, item_name) {
//     // SSID Password
//     // "input value,
//     // 8 - 64 characters
//     // * alphabet (A-Z and a-z), digits (0-9) and symbols(except for [,], [""], [:], [;], [\], [�ｼ], [&], [%], [+], ['], [<], [>], [?])    
//     // or 64 hexadecimal (a-z, A-F and 0-9)
//     var item = $("#" + id).val();
//     var noRe = /^[a-zA-Z0-9~! @#$^*()_=\-`\[\]{}./|]+$/;
//     // var noRe = /[\,�彌"�彌:�彌;�彌\�彌ﾂ･|\�･�彌&�彌%�彌+�彌'�彌<�彌>�彌?|^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
//     var re = noRe.test(item);
//     var VALID;
//     var itemBytes = stringToBytes(item);
//     if (itemBytes > 0) {
//         if (itemBytes < min) {
//             VALID = 0;
//             alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
//             //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
//             $("#" + id).focus();
//         } else if (itemBytes > max) {
//             VALID = 0;
//             alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
//             //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
//             $("#" + id).focus();
//         } else if(itemBytes == 64) {
//             var noReHex = /^[a-fA-F0-9]+$/;
//             var reHex = noReHex.test(item);
//             if(!reHex)
//             {
//                 VALID = 0;
//                 alert(item_name + $.i18n.prop("error.macaddressformat"))
//                 $("#" + id).focus();
//             }
//             else
//             {
//                 VALID = 1;
//             }
//         } else if (!re) {
//             VALID = 0;
//             alert(item_name + $.i18n.prop("error.checkNameStringType7"))
//             $("#" + id).focus();
//         } else {
//             VALID = 1;
//         }
//     } else {
//         VALID = 0;
//         alert($.i18n.prop("error.Field_Empty"))
//         $("#" + id).focus();
//     }
//     return VALID;
// }


function checkNameStringType7(id, min, max, item_name) {
    // SSID Password
    // "input value,
    // 8 - 64 characters
    // * alphabet (A-Z and a-z), digits (0-9) and symbols(except for [,], [""], [:], [;], [\], [�ｼ], [&], [%], [+], ['], [<], [>], [?])    
    // or 64 hexadecimal (a-z, A-F and 0-9)
    var item = $("#" + id).val();
    var noRe = /^[a-zA-Z0-9~! @#$^*()_=\-`\[\]{}./|]+$/;
    //var noRe = /[\,�彌"�彌:�彌;�彌\�彌ﾂ･|\�･�彌&�彌%�彌+�彌'�彌<�彌>�彌?|^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    var re = noRe.test(item);
    var VALID;
    var itemBytes = stringToBytes(item);
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var noReHex = /^[a-fA-F0-9]+$/;
    var reHex = noReHex.test(item); 

    if(id == "SSID_A_Password" && (SSID_A_Security == "3" || SSID_A_Security == "4") )
    {
        max = 63;
    }
    if(id == "SSID_B_Password" && (SSID_B_Security == "3" || SSID_B_Security == "4") )
    {
        max = 63;
    }    

    if (itemBytes > 0) {
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if(itemBytes == 64) {
            //check security
            if(id == "SSID_A_Password")
            {
                if(SSID_A_Security=="3")
                {
                    // if (!re) {
                    //     VALID = 0;
                    //     alert(item_name + $.i18n.prop("error.checkNameStringType7"))
                    //     $("#" + id).focus();
                    // }
                    // else
                    // {
                    //     VALID = 1;
                    // }
                    //max = 63;
                    VALID = 0;
                    alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
                    //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
                    $("#" + id).focus();
                }
                else
                {
                    if(!reHex)
                    {
                        VALID = 0;
                        alert(item_name + $.i18n.prop("error.macaddressformat"))
                        $("#" + id).focus();
                    }
                    else
                    {
                        VALID = 1;
                    }                    
                }
            }
            else
            {
                if(SSID_B_Security=="3")
                {
                    // if (!re) {
                    //     VALID = 0;
                    //     alert(item_name + $.i18n.prop("error.checkNameStringType7"))
                    //     $("#" + id).focus();
                    // }
                    // else
                    // {
                    //     VALID = 1;
                    // }
                    VALID = 0;
                    //max = 63;
                    alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
                    //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
                    $("#" + id).focus();   
                }
                else
                {
                    if(!reHex)
                    {
                        VALID = 0;
                        alert(item_name + $.i18n.prop("error.macaddressformat"))
                        $("#" + id).focus();
                    }
                    else
                    {
                        VALID = 1;
                    }                    
                }
            }
        } else if (!re) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType7"))
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType8(id, min, max, item_name) {
    // Web UI Password
    // "input value,
    // 8 - 32 characters
    // * alphabet (A-Z and a-z), digits (0-9) and symbols(except for [,], [""], [:], [;], [\], [�ｼ], [&], [%], [+], ['], [<], [>], [?])    
    var item = $("#" + id).val();
    var noRe = /^[a-zA-Z0-9~! @#$^*()_=\-`\[\]{}./|]+$/;
    // var noRe = /[\,�彌"�彌:�彌;�彌\�彌ﾂ･|\�･�彌&�彌%�彌+�彌'�彌<�彌>�彌?|^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    var re = noRe.test(item);
    var VALID;
    var itemBytes = stringToBytes(item);
    if (itemBytes > 0) {
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (!re) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.checkNameStringType8"))
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType9(id, min, max, item_name) {
    // CPE SSID Password
    // "input value,
    //     笆� The Security is WPA2 or WPA/WPA2:
    //     ** 8 - 63 characters ** alphabet (A-Z and a-z), digits (0-9) and
    //    symbols(ALL)
    //    OR
    //     ** 64 hexadecimal digits (0-9, A-F, a-f)
    //    笆� The Security is WPA3 or WPA2/WPA3
    //    ** 8 - 63 characters (64 digits password can't be used)
    //    ** alphabet (A-Z and a-z), digits (0-9) and symbols(ALL)
    var item = $("#" + id).val();
    //var regex = /[愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
    // var noRe = /^[a-zA-Z0-9~! ,:;ﾂ･�･'"&%+<>?@#$^*()_=\-`\[\]{}\\.\/|]+$/;
    var noRe = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~]+$/;

    //var noRe = /[\,�彌"�彌:�彌;�彌\�彌ﾂ･|\�･�彌&�彌%�彌+�彌'�彌<�彌>�彌?|^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    //var japanCharCheck = regex.test(item);
    var re = noRe.test(item);
    var VALID;
    var itemBytes = stringToBytes(item);
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var noReHex = /^[a-fA-F0-9]+$/;
    var reHex = noReHex.test(item); 

    if(id == "SSID_A_Password" && (SSID_A_Security == "3" || SSID_A_Security == "4") )
    {
        max = 63;
    }
    if(id == "SSID_B_Password" && (SSID_B_Security == "3" || SSID_B_Security == "4") )
    {
        max = 63;
    }    

    if (itemBytes > 0) {
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if(itemBytes == 64) {
            //check security
            if(id == "SSID_A_Password")
            {
                if(SSID_A_Security=="3" || SSID_A_Security=="4")
                {
                    // if (!re) {
                    //     VALID = 0;
                    //     alert(item_name + $.i18n.prop("error.checkNameStringType7"))
                    //     $("#" + id).focus();
                    // }
                    // else
                    // {
                    //     VALID = 1;
                    // }
                    //max = 63;
                    VALID = 0;
                    alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
                    //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
                    $("#" + id).focus();
                }
                else
                {
                    if(!reHex)
                    {
                        VALID = 0;
                        alert(item_name + $.i18n.prop("error.macaddressformat"))
                        $("#" + id).focus();
                    }
                    else
                    {
                        VALID = 1;
                    }                    
                }
            }
            else
            {
                if(SSID_B_Security=="3" || SSID_B_Security=="4")
                {
                    // if (!re) {
                    //     VALID = 0;
                    //     alert(item_name + $.i18n.prop("error.checkNameStringType7"))
                    //     $("#" + id).focus();
                    // }
                    // else
                    // {
                    //     VALID = 1;
                    // }
                    VALID = 0;
                    //max = 63;
                    alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
                    //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
                    $("#" + id).focus();   
                }
                else
                {
                    if(!reHex)
                    {
                        VALID = 0;
                        alert(item_name + $.i18n.prop("error.macaddressformat"))
                        $("#" + id).focus();
                    }
                    else
                    {
                        VALID = 1;
                    }        
                    
                }
            }
        } else {
            //check format 
            // if (japanCharCheck) {
            //     VALID = 0;
            //     alert(item_name + $.i18n.prop("error.ssidpasswordformat"))
            //     $("#" + id).focus();
            // }
            if(!re)
            {
                VALID = 0;
                alert(item_name + $.i18n.prop("error.ssidpasswordformat"))
                $("#" + id).focus();
            }
            else
            {
                VALID = 1;
            }                     
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}

function checkNameStringType10(id, min, max, item_name) {
    // CPE Web UI Password
    // "input value,
    // 8 - 32 characters
    //~! @#$^*()_=\-`\[\]{}./|
    // * alphabet (A-Z and a-z), digits (0-9) and symbols(ALL)
    //* It should have one numeric one lowecase one upper case letter and one special character.
    
    var item = $("#" + id).val();
    //check japanese
    var regex = /[愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
    var noRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*?[ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~])(?=.{8,})/;
    // var noRe = /^[a-zA-Z0-9ﾂ･�･!"#$%&'()*+,-.\/:;<=>?@\\[\]^_`{|}~]+$/;

    //var noRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{8,}$/;
    //var noRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~! ,@#$^*()_=\-`\[\]{}./|])[0-9a-zA-Z~! ,@#$^*()_=\-`\[\]{}./|]{8,}$/;
    //var noRe = /[\,�彌"�彌:�彌;�彌\�彌ﾂ･|\�･�彌&�彌%�彌+�彌'�彌<�彌>�彌?|^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    var japanCharCheck = regex.test(item);
    var re = noRe.test(item);
    var VALID;
    var itemBytes = stringToBytes(item);
    if (itemBytes > 0) {
        if (itemBytes < min) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (itemBytes > max) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.stringlengthbetween1") + item_name + $.i18n.prop("error.stringlengthbetween2") + min + $.i18n.prop("error.stringlengthbetween3") + max + $.i18n.prop("error.stringlengthbetween4"))
            //alert(item_name + $.i18n.prop("error.stringlengthbetween1")+ min + $.i18n.prop("error.stringlengthbetween2") + max + $.i18n.prop("error.stringlengthbetween3"))
            $("#" + id).focus();
        } else if (japanCharCheck) {
            VALID = 0;
            alert(item_name + $.i18n.prop("error.ssidpasswordformat"))
            $("#" + id).focus();
        } else if (!re) {
            VALID = 0;
            alert($.i18n.prop("setting.ui.newpasswordformat"))
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    } else {
        VALID = 0;
        alert($.i18n.prop("error.Field_Empty"))
        $("#" + id).focus();
    }
    return VALID;
}


function checkJapaneseChar(item) {
    //check japanese
    var regex = /[愚｡或憲属｢ｽｮ溟｡垓ｸｴ℡]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
    var VALID;

    if(regex.test(item)) {

        // console.log("Japanese characters found")
        VALID = 0
     }

     else {

        //  console.log("No Japanese characters");
         VALID = 1
     }   


    return VALID;
}

function stringToBytes(item) {
    var str = encodeURIComponent(item);
    len = str.replace(/%[A-F\d]{2}/g, 'U').length;
    return len;
}   

function AddtoAllow() {
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetMACAddressFilterMACList",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                var _macaddress = $("#allow_macaddress").text();
                var MACList = $("#allow_macaddress").text();
                MACList = MACList + '|'+ $.i18n.prop("lan.wifi.mac.filter.AddFromConnectedClients");
                var macaddress = obj.MACList;
                var tempArray, subtempArray;
                var flag = true;
                if (macaddress != "") {
                    tempArray = macaddress.split(",");
                    var macAmount = tempArray.length;
                    var displayAmount = 10 - macAmount;
                    if (macAmount >= 10) {
                        alert($.i18n.prop("lan.wifi.mac.filter.over10"));
                    }
                    else
                    {
                        for (i = 0; i < tempArray.length; i++) {
                            subtempArray = tempArray[i].split("|");
                            subid = subtempArray[0];
                            subaddress = subtempArray[1];
                            subdesc = subtempArray[2];
                            if(subaddress == _macaddress)
                            {
                                flag = false;
                                break;
                            }
                        }
                        if(flag) 
                        {
                            $.LoadingOverlay("show");
                            $.ajax({
                                type: "POST",
                                url: "../../cgi-bin/qcmap_web_cgi",
                                data: {
                                    Page: "AddMACAddressFilterMACList",
                                    MACList: MACList,
                                    token: session_token
                                },
                                dataType: "text",
                                success: function (msgs) {
                                    $.LoadingOverlay("hide");
                                    var obj = jQuery.parseJSON(msgs);
                                    if (obj.result == "AUTH_FAIL") {
                                        clearSession();
                                        alert($.i18n.prop("error.AUTH_FAIL"));
                                        return;
                                    }
                                    if (obj.result == "Token_mismatch") {
                                        clearSession();
                                        alert($.i18n.prop("error.Token_mismatch"));
                                        return;
                                    }
                                    if (obj.commit == "Socket Send Error") {
                                        clearSession();
                                        alert($.i18n.prop("error.SocketSendError"));
                                        return;
                                    }
                                    if (obj.result == "QTApp_Login") {
                                        clearSession();
                                        alert($.i18n.prop("common.Routerdeviceinuse"));
                                        return;
                                    }
                                    if (obj.Result == "SUCCESS") {

                                        alert($.i18n.prop("success.message"));
                                        location.reload();
                                    } else {
                                        alert(obj.Result);
                                        return;
                                    }
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    //$.LoadingOverlay("hide");
                                    clearSession();
                                    //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                                }
                            });
                        }
                        else
                        {
                            alert($.i18n.prop("error.macaddressduplicated"));      
                            $("#ConfirmAddtoAllow").modal("hide");
                            $("#addApplyMACDisconnectModal").modal("hide");
                                     
                        }
                    }
                } else {
                    $.LoadingOverlay("show");
                    $.ajax({
                        type: "POST",
                        url: "../../cgi-bin/qcmap_web_cgi",
                        data: {
                            Page: "AddMACAddressFilterMACList",
                            MACList: MACList,
                            token: session_token
                        },
                        dataType: "text",
                        success: function (msgs) {
                            $.LoadingOverlay("hide");
                            var obj = jQuery.parseJSON(msgs);
                            if (obj.result == "AUTH_FAIL") {
                                clearSession();
                                alert($.i18n.prop("error.AUTH_FAIL"));
                                return;
                            }
                            if (obj.result == "Token_mismatch") {
                                clearSession();
                                alert($.i18n.prop("error.Token_mismatch"));
                                return;
                            }
                            if (obj.commit == "Socket Send Error") {
                                clearSession();
                                alert($.i18n.prop("error.SocketSendError"));
                                return;
                            }
                            if (obj.result == "QTApp_Login") {
                                clearSession();
                                alert($.i18n.prop("common.Routerdeviceinuse"));
                                return;
                            }
                            if (obj.Result == "SUCCESS") {

                                alert($.i18n.prop("success.message"));
                                location.reload();
                            } else {
                                alert(obj.Result);
                                return;
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            //$.LoadingOverlay("hide");
                            clearSession();
                            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
                        }
                    });                    
                }
        
            } else {
                alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function closeConfirmManualSearch()
{
    $("#network_search option[value='0']").prop('selected', true);
    $('#current_network_section').show();  
    $('#SetApply').show();        
    $("#search_network_section").hide();
    $("#ManualApply").hide(); 
    $("#confirmManualSearch").modal("hide");
}

function closeAgainManualSearch()
{
    $("#network_search option[value='0']").prop('selected', true);
    $('#current_network_section').show();  
    $('#SetApply').show();        
    $("#search_network_section").hide();
    $("#ManualApply").hide();     
    $("#againManualSearch").modal("hide");
}

function htmlEncode ( html )
{
    html = $.trim(html);
    return html.replace(/[&"'\<\>]/g, function(c) 
    {
          switch (c) 
          {
              case "&":
                return "&amp;";
              case "'":
                return "&#39;";
              case '"':
                return "&quot;";
              case "<":
                return "&lt;";
              default:
                return "&gt;";
          }
    });
};

function sessionCheckToServer()
{
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetWebRunningStatus",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //alert(obj.result)
                //clearSession();
                return;
            }
            if (obj.result == "Token_mismatch") {
                //alert(obj.result)
                //clearSession();
                return;
            }
            if (obj.commit == "Socket Send Error") {
                //alert(obj.commit)
                //clearSession();
                return;
            }
            if (obj.result == "QTApp_Login") {
                //alert(obj.result)
                //clearSession();
                return;
            }
            if (obj.Result == "SUCCESS") {
                var server_status = obj.Value;
                if(server_status == 0)
                {
                    clearSession();
                }
            } 
        },
        error: function (xhr, textStatus, errorThrown) {
            //clearSession();
        }
    });    
}

function ConfirmRestore() {
    $('#confirmRestore').modal('show');
}

function GetWifiDFSState()
{
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetWifiDFSState",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                return;
            }
            if (obj.result == "Token_mismatch") {
                return;
            }
            if (obj.commit == "Socket Send Error") {
                return;
            }
            if (obj.result == "QTApp_Login") {
                return;
            }
            if (obj.Result == "SUCCESS") {
                var DFS_state = obj.Value;
                if(DFS_state != "DFS")
                {
                    $(".dfs_icon").hide();   
                    $("#confirmACNo").modal("hide");                   
                    $.LoadingOverlay("hide");                
                    clearInterval(downloadTimer);    
                    clearInterval(dfsCheckToServer);
                    alert($.i18n.prop("success.message"));
                    location.reload();
                    // setTimeout(function (){
                    //   // Something you want delayed.
                    //     alert($.i18n.prop("success.message"));
                    // }, 500); // How long do you want the delay to be (in milliseconds)? 
                }
            } 
        }
    });    
}

function addApplyMACDisconnectModal(){
    $("#addApplyMACDisconnectModal").modal("show");
}

function openUpdateConfirmMACAddressModal(){
    $("#openUpdateConfirmMACAddressModal").modal("show");
}

function homeSessionCheckToServer() {
    $.ajax({
      type: "POST",
      url: "../../cgi-bin/qcmap_web_cgi",
      data: {
        Page: "GetAutoRebootConfig",
        mask: "0",
        token: session_token
      },
      dataType: "text",
      success: function (msgs) {
        var obj = jQuery.parseJSON(msgs);
        if (obj.result == "AUTH_FAIL") {
          clearSession();
          return;
        }
        if (obj.result == "Token_mismatch") {
          clearSession();
          return;
        }
        if (obj.commit == "Socket Send Error") {
          clearSession();
          return;
        }
        if (obj.result == "QTApp_Login") {
          //clearSession();
          return;
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        //clearSession();
      }
    });
  }

  function openAttentionModal(){
    var Select_Stationary_mode = $("#Select_Stationary_mode").val();
    var OLD_StationMode_state = $("#OLD_StationMode_state").val();
    if(OLD_StationMode_state == Select_Stationary_mode)
    {
        alert($.i18n.prop("stationmode.top17"));
        return ;
    }
    else
    {
      if(Select_Stationary_mode == "1" || Select_Stationary_mode == "2")
      {
        $("#attentionModal").modal("show");
      }
      else
      {
        $("#confirmStationaryModeOff").modal("show");
      }
    }
  }

  function openConfirmStationaryMode(){
      $("#attentionModal").modal("hide");
      $("#confirmStationaryMode").modal("show");
  }

function GetModifyStationMode()
{
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "ModifyStationMode",
            Set: 0, 
            State: 0,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                var StationMode_state = obj.State;
                if(StationMode_state == "1")
                {
                    $("#Select_Stationary_mode option[value='1']").prop('selected', true);
                }
                else if(StationMode_state == "2")
                {
                    $("#Select_Stationary_mode option[value='2']").prop('selected', true);
                }                
                else
                {
                    $("#Select_Stationary_mode option[value='0']").prop('selected', true);
                }

                //get AC & pin lock status
                getACAndPinStatus(StationMode_state);
            } 
        }
    });    
}

function GetModifyStationModeAtPINPage()
{
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "ModifyStationMode",
            Set: 0, 
            State: 0,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                var StationMode_state = obj.State;
                if(StationMode_state == "1" || StationMode_state == "2")
                {
                    $("#apply33").prop('disabled', true);
                    $("#stationmodeMsg").show();
                }
            } 
        }
    });    
}

function GetModifyStationModeAtSoftwarePage()
{
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "ModifyStationMode",
            Set: 0, 
            State: 0,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                var StationMode_state = obj.State;
                if(StationMode_state == "1" || StationMode_state == "2")
                {
                    $("#update2").prop('disabled', true);
                    $("#stationmodeMsg").show();
                }
            } 
        }
    });    
}

function getACAndPinStatus(StationMode_state)
{
    //Get AC status
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetHomeDeviceInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            //$.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
                var AC_status = obj.BatteryStatus;
               //get pin status
                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_web_cgi",
                    data:
                    {
                      Page: "GetSIMState",
                      mask: "0",
                      token: session_token
                    },
                    dataType: "text",
                    success: function (msgs) {
                      var obj = jQuery.parseJSON(msgs);
                      if (obj.result == "AUTH_FAIL") {
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                      }
                      if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                      }
                      if (obj.commit == "Socket Send Error") {
                        clearSession();
                        alert($.i18n.prop("error.SocketSendError"));
                        return;
                      }
                      if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                      }              
                      //Ready,PIN1 Lock,PUK1 Lock,PERM_DISABLED,Absent,Error
                      var get_sim_status = obj.Get_SIM_State_Result;
                      var sim_status = obj.SIM_State; 
                      var simlock_status = obj.SIM_Lock_Enable; // 1:enable,0:disable
                     // result['simlock_status'] = simlock_status;
                      // result = {
                      //   AC_status : AC_status,
                      //   simlock_status : simlock_status
                      // };
                        if (StationMode_state == "1" && AC_status != "Charging" && AC_status != "Full" ) {
                            $("#applyStationaryMode").prop('disabled', true);
                            $("#stationmodeMsg").show();
                        }else if(StationMode_state == "1" && simlock_status == "1") {
                            $("#applyStationaryMode").prop('disabled', true);
                            $("#stationmodeMsg").show();
                        }else {
                            $("#applyStationaryMode").prop('disabled', false);
                        }
                        $("#OLD_StationMode_state").val(StationMode_state);
                        $("#AC_status").val(AC_status);
                        $("#simlock_status").val(simlock_status);

                    }
                  });                                 
            
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });   
}

function ModifyStationMode() {

    var OLD_StationMode_state = $("#OLD_StationMode_state").val();
    var State = $("#Select_Stationary_mode").val();
    if(OLD_StationMode_state == State)
    {
        alert($.i18n.prop("stationmode.top17"));
        return ;
    }
    
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    //check AC &PIN
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetHomeDeviceInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            //$.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
                var AC_status = obj.BatteryStatus;
               //get pin status
                $.ajax({
                    type: "POST",
                    url: "../../cgi-bin/qcmap_web_cgi",
                    data:
                    {
                      Page: "GetSIMState",
                      mask: "0",
                      token: session_token
                    },
                    dataType: "text",
                    success: function (msgs) {
                      var obj = jQuery.parseJSON(msgs);
                      if (obj.result == "AUTH_FAIL") {
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                      }
                      if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                      }
                      if (obj.commit == "Socket Send Error") {
                        clearSession();
                        alert($.i18n.prop("error.SocketSendError"));
                        return;
                      }
                      if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                      }              
                      //Ready,PIN1 Lock,PUK1 Lock,PERM_DISABLED,Absent,Error
                      var get_sim_status = obj.Get_SIM_State_Result;
                      var sim_status = obj.SIM_State; 
                      var simlock_status = obj.SIM_Lock_Enable; // 1:enable,0:disable

                      var State = $("#Select_Stationary_mode").val();
                      if(State == "0") //disable
                      {
                        executeModifyStationMode();
                      }
                      else //enable
                      {
                        if (AC_status != "Charging" && AC_status != "Full") {
                            alert($.i18n.prop("stationmode.top16"));
                            location.reload();
                        }else if(simlock_status == "1") {
                            alert($.i18n.prop("stationmode.top16"));
                            location.reload();
                        }else {
                            //execute
                            executeModifyStationMode();
                        }
                      }
                    }
                  });                                 
            
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });   
}

function executeModifyStationMode()
{
    var State = $("#Select_Stationary_mode").val();
    var OLD_StationMode_state = $("#OLD_StationMode_state").val();

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "ModifyStationMode",
            Set: 1,
            State: State,    
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                alert($.i18n.prop("success.message"));
                //location.reload();             
                if(State == 1 || State == 2)
                {
                    //restart
                    $.LoadingOverlay("show");
                    SessionIdleInterval = self.setInterval("sessionCheckToServer()", 5000); // 5 seconds check again
                }
                else
                {
                    //logout
                    clearSession();
                }

            } else {
                alert(obj.Result);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
        }
    });    
}

function checkAllowCountryCode(code)
{
    var flag = false;
    for(i=0; i<allowCountryCode.length; i++){
        if(code == allowCountryCode[i])
        {
            flag = true;
            break;
        }
        else
        {
            flag = false;
        }
    }
    return flag;
}

function durationTimeDisplay(second) {
    var input = {
        year: 0,
        month: 0,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: second
    };
    var timestamp = new Date(input.year, input.month, input.day,
        input.hours, input.minutes, input.seconds);
    var interval = 0;
    timestamp = new Date(timestamp.getTime() + interval * 1000);
    var currentdays = Math.floor(second / (60 * 60 * 24)); 
    var currenthours = timestamp.getHours();
    currenthours = ("0" + currenthours).slice(-2);
    var currentmins = timestamp.getMinutes();
    currentmins = ("0" + currentmins).slice(-2);
    var currentsecs = timestamp.getSeconds();
    currentsecs = ("0" + currentsecs).slice(-2);
    var display;
    if(currentdays>0)
    {
        display = currentdays+"<span data-locale='days'>"+ $.i18n.prop("days") +"</span>"+" "+currenthours + ':' + currentmins;
    }
    else
    {
        display = currenthours + ':' + currentmins;
    }
    document.getElementById('DurationTime').innerHTML = display;
}

function ConfirmEthernetSetting()
{
    $("#ConfirmEthernetSetting").modal("show");
}

function GetEthernetSetting() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetEthernetConfig",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "SUCCESS") {
                var Power = String(obj.Power);
                var Speed = String(obj.Speed);
                // $("#OLD_Tethering").val(obj.Tethering);
                // $("#OLD_Mode").val(obj.Mode);

                if (Speed == "2") {
                    $("#ethernetSpeed option[value=2]").prop('selected', true);
                } else if (Speed == "0") {
                    $("#ethernetSpeed option[value=0]").prop('selected', true);
                }
                findKittyKey('Communication_Speed', 'ethernetSpeed');
                findKittyKey('Communication_Speed', 'apply');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetEthernetSetting() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var Speed = $("#ethernetSpeed").val();
    // var OLD_Mode = $("#OLD_Mode").val();
    var form = {
        Page: "SetEthernetConfig",
        Speed: Speed,
        token: session_token
    };
    var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetEthernetConfig",
                Speed: Speed,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "SUCCESS") {
                    alert($.i18n.prop("success.message"));
                    location.reload();
                }
                else
                {
                    alert(obj.Result);
                    clearSession();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                clearSession();
            }
        });

    }
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds;
}

function checkMacaddressIsExist(mac1address,mac2address,mac3address,mac4address,mac5address,mac6address,mac7address,mac8address,mac9address,mac10address)
{
    mac1address = mac1address.toLowerCase();
    mac2address = mac2address.toLowerCase();
    mac3address = mac3address.toLowerCase();
    mac4address = mac4address.toLowerCase();
    mac5address = mac5address.toLowerCase();
    mac6address = mac6address.toLowerCase();
    mac7address = mac7address.toLowerCase();
    mac8address = mac8address.toLowerCase();
    mac9address = mac9address.toLowerCase();
    mac10address = mac10address.toLowerCase();

    var temp = [
        mac1address,
        mac2address,
        mac3address,
        mac4address,
        mac5address,
        mac6address,
        mac7address,
        mac8address,
        mac9address,
        mac10address
    ];
    var arr = temp.filter(function (el) {
        return el != "";
    });    
    var map = {};
    var result = false;
    for(var i = 0; i < arr.length; i++) {
        // check if object contains entry with this element as key
        if(map[arr[i]]) {
           result = true;
           // terminate the loop
           break;
        }
        // add entry in object with the element as key
        map[arr[i]] = true;
     }
     if(result) {
        return true;
     } else {
        return false;
     } 
}

function GetPortTriggerStatus(callFunc1) {
    if (!callFunc1) callFunc1 = null;
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetSetPortTriggerStatus",
            mask: 1,
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            //if (obj.GetGlobalWifiResult == "SUCCESS") {
                if (obj.Result == "SUCCESS") {
                    $("#OLD_PortTriggerStatus").val(obj.status)
                    if (obj.status == "1") {
                        $("#Select_Portrigger_enable option[value=1]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('on');
                    } else if (obj.status == "0") {
                        $("#Select_Portrigger_enable option[value=0]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('off');
                    }                    
                    if (callFunc1) {
                        callFunc1();
                    }  
                    //KittyLock    
                }
              
        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}

function ConfirmSetPortTriggerEnable() {

    $('#confirmPorttrigger').modal('show');
    
}

function SetPortTriggerStatus() {
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var OLD_PortTriggerStatus = $("#OLD_PortTriggerStatus").val();
    if(OLD_PortTriggerStatus == $("#Select_Portrigger_enable").val()) {
        alert($.i18n.prop("success.message"));
        location.reload();
    }else {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "GetSetPortTriggerStatus",
                mask: 2,
                status: $("#Select_Portrigger_enable").val(),
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                //if (obj.GetGlobalWifiResult == "SUCCESS") {
                    if (obj.Result == "SUCCESS") {
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    }
            },
            error: function (xhr, textStatus, errorThrown) {
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }

}

function GetPortTriggerEntries() {
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetPortTriggerEntries",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                //clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            //if (obj.GetGlobalWifiResult == "SUCCESS") {
                if (obj.snat_error == "SUCCESS") {
                    var income_port, income_port_end, income_proto, name, trigger_port, trigger_port_end, trigger_proto, income_port_display, trigger_port_display;
                    $("#Port_List").val(JSON.stringify(obj.entries));
                    $("#rules_Total").val(obj.snat_count)
    
                    for (i = 0; i < obj.snat_count; i++) {
                        name = obj.entries[i].name;
                        income_port = obj.entries[i].income_port;
                        income_port_end = obj.entries[i].income_port_end;
                        income_proto = obj.entries[i].income_proto;
                        trigger_port = obj.entries[i].trigger_port;
                        trigger_port_end = obj.entries[i].trigger_port_end;
                        trigger_proto = obj.entries[i].trigger_proto;
                        
                        //
                        if(income_port != income_port_end) {
                            income_port = income_port + '-' + income_port_end
                        }
    
                        switch (income_proto) {
                            case "6":
                                income_port_display = 'TCP';
                                break;
                            case "17":
                                income_port_display = 'UDP';
                                break;
                            case "253":
                                income_port_display = 'TCP/UDP';
                                break;
                            default:
                                income_port_display = '';
                                break;
                        }
                        switch (trigger_proto) {
                            case "6":
                                trigger_port_display = 'TCP';
                                break;
                            case "17":
                                trigger_port_display = 'UDP';
                                break;
                            case "253":
                                trigger_port_display = 'TCP/UDP';
                                break;
                            default:
                                trigger_port_display = '';
                                break;
                        }

                        card += '<div class="col-12 col-md-6 col-lg-6 text-center align-self-center">'+
                        '<div class="card-edit-body">'+
                          '<div class=" row col-12" style="margin-left:0px; margin-right:0px; padding-top:10px; padding-bottom: 10px;">'+
                            '<div class="col-12 col-sm-12 col-md-12 col-lg-4 text-center mt-1">'+
                              '<img class="card-image " alt="image" src="assets/img/5g_content/card_image_network.svg">'+
                            '</div>'+
                            '<div class="col-form-label text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-center mt-1">'+
                              '<small style="color:#9EA8B3"><span data-locale="lan.port.trigger.UsePortTrigger.RuleName">' + $.i18n.prop("lan.port.mapping.RuleName") + '</span></small>'+
                              '<dt class="card-empty-font">' + name + '</dt>'+
                              '<small style="color:#9EA8B3"><span data-locale="lan.port.trigger.UsePortTrigger.TriggerPort">' + $.i18n.prop("lan.port.trigger.UsePortTrigger.TriggerPort") + '</span></small>'+
                              '<dt class="card-empty-font">' + trigger_port + '</dt>'+
                              '<small style="color:#9EA8B3"><span data-locale="lan.port.trigger.UsePortTrigger.OpenPort">' + $.i18n.prop("lan.port.trigger.UsePortTrigger.OpenPort") + '</span></small>'+
                              '<dt class="card-empty-font">' + income_port + '</dt>'+                          
                            '</div>'+
                            '<div class="col-form-label text-left col-12 col-sm-6 col-md-6 col-lg-4 align-self-center mt-1">'+
                                '<small style="color:#9EA8B3"><dt class="card-empty-font"></dt></small>'+
                                '<dt class="card-empty-font"></dt>   '+    
                              '<small style="color:#9EA8B3"><span data-locale="lan.port.trigger.UsePortTrigger.TriggerProtocol">' + $.i18n.prop("lan.port.trigger.UsePortTrigger.TriggerProtocol") + '</span></small>'+
                              '<dt class="card-empty-font">' + trigger_port_display + '</dt>'+
                              '<small style="color:#9EA8B3"><span data-locale="lan.port.trigger.UsePortTrigger.OpenProtocol">' + $.i18n.prop("lan.port.trigger.UsePortTrigger.OpenProtocol") + '</span></small>'+
                              '<dt class="card-empty-font">' + income_port_display + '</dt>'+                     
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card-edit-footer">'+
                            '<div class="row text-right mr-1">' +
                                '<div class="col-12 col-md-12 col-lg-12 align-self-center mt-1">' +
                                '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmDeletePortTrigger(\'' + i + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg"><span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span></button>' +
                                '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmEditPortTrigger(\'' + i + '\')"" ><img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg"><span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span></button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                      '</div>'
                    }
                    if (card != "") {
                        $("#card").html(card);
                    }
                    console.log('card:'+card)
                    //KittyLock    
                }
            
            




        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}

function addPortTriggerConfirm() {
    var rules_Total = $("#rules_Total").val() ? $("#rules_Total").val() : 0;
    if (rules_Total >= 20) {
        alert($.i18n.prop("error.addportmappingmore20"));
        return false;
    }
    else {
        $("#addPortTrigger").modal("show");
    }
}

function addPortTrigger() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";   
    var Select_Firewall_enable = $("#Select_Firewall_enable").val();
    // var pkts_allowed = $("#pkts_allowed").val();
    var flag = addPortTrigger_check();
    if(flag) {
        $.LoadingOverlay("show");
        var checkPortAny = checkPortIsAny('income_port');
        var checkPortRange = checkPortIsRange('income_port');
        var income_port, income_port_end;
        if(checkPortAny) {
            income_port = 1;
            income_port_end = 65535; 
        }else if(checkPortRange) {
            var temp = $("#income_port").val().split("-");
            income_port = parseInt(temp[0]);
            income_port_end = parseInt(temp[1]);    
        }else {
            income_port = $("#income_port").val();
            income_port_end = $("#income_port").val();
        }
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "AddPortTriggerEntry",                 
                type: "1",
                trigger_port: $("#trigger_port").val(),
                trigger_port_end: $("#trigger_port").val(),
                trigger_proto: $("#trigger_proto").val(),
                income_port: income_port,
                income_port_end: income_port_end,
                income_proto: $("#income_proto").val(),
                name: $("#name").val(),
                token: session_token,
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "NO EFFECT") {
                    alert($.i18n.prop("error.NOEFFECT"));
                    return;
                }
                if (obj.Result == "INFO UNAVAILABLE") {
                    alert($.i18n.prop("error.INFOUNAVAILABLE"));
                    return;
                }
                if (obj.Result == "SEGMENT TOO LONG") {
                    alert($.i18n.prop("error.SEGMENTTOOLONG"));
                    return;
                }
                if (obj.Result == "SEGMENT ORDER") {
                    alert($.i18n.prop("error.SEGMENTORDER"));
                    return;
                }
                if (obj.Result == "BUNDLING NOT SUPPORTED") {
                    alert($.i18n.prop("error.BUNDLINGNOTSUPPORTED"));
                    return;
                }
                if (obj.Result == "OP PARTIAL FAILURE") {
                    alert($.i18n.prop("error.porttrigger.OPPARTIALFAILURE"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                        alert($.i18n.prop("success.message"));
                        location.reload();

                } else {
                    alert(obj.result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                // clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

// function addPortTrigger() {
//     var checkLogin = checkSession();
//     if (checkLogin == "off") {
//         backToHome();
//         return false;
//     }
//     var Error_Msg = "";   
//     var Select_Firewall_enable = $("#Select_Firewall_enable").val();
//     // var pkts_allowed = $("#pkts_allowed").val();
//     var flag = addPortTrigger_check();
//     if(flag) {
//         $.LoadingOverlay("show");
//         var checkPortAny = checkPortIsAny('trigger_port');
//         var checkPortRange = checkPortIsRange('trigger_port');
//         var trigger_port, trigger_port_end;
//         if(checkPortAny) {
//             trigger_port = 1;
//             trigger_port_end = 65535; 
//         }else if(checkPortRange) {
//             var temp = $("#trigger_port").val().split("-");
//             trigger_port = parseInt(temp[0]);
//             trigger_port_end = parseInt(temp[1]);    
//         }else {
//             trigger_port = $("#trigger_port").val();
//             trigger_port_end = $("#trigger_port").val();
//         }
//         $.ajax({
//             type: "POST",
//             url: "../../cgi-bin/qcmap_web_cgi",
//             data: {
//                 Page: "AddPortTriggerEntry",                 
//                 type: "1",
//                 trigger_port: trigger_port,
//                 trigger_port_end: trigger_port_end,
//                 trigger_proto: $("#trigger_proto").val(),
//                 income_port: $("#income_port").val(),
//                 income_port_end: $("#income_port").val(),
//                 income_proto: $("#income_proto").val(),
//                 name: $("#name").val(),
//                 token: session_token,
//             },
//             dataType: "text",
//             success: function (msgs) {
//                 $.LoadingOverlay("hide");
//                 var obj = jQuery.parseJSON(msgs);
//                 if (obj.result == "AUTH_FAIL") {
//                     //clearSession();
//                     clearSession();
//                     alert($.i18n.prop("error.AUTH_FAIL"));
//                     return;
//                 }
//                 if (obj.result == "Token_mismatch") {
//                     clearSession();
//                     alert($.i18n.prop("error.Token_mismatch"));
//                     return;
//                 }
//                 if (obj.commit == "Socket Send Error") {
//                     clearSession();
//                     alert($.i18n.prop("error.SocketSendError"));
//                     return;
//                 }
//                 if (obj.result == "QTApp_Login") {
//                     clearSession();
//                     alert($.i18n.prop("common.Routerdeviceinuse"));
//                     return;
//                 }
//                 if (obj.Result == "NO EFFECT") {
//                     alert($.i18n.prop("error.NOEFFECT"));
//                     return;
//                 }
//                 if (obj.Result == "INFO UNAVAILABLE") {
//                     alert($.i18n.prop("error.INFOUNAVAILABLE"));
//                     return;
//                 }
//                 if (obj.Result == "SEGMENT TOO LONG") {
//                     alert($.i18n.prop("error.SEGMENTTOOLONG"));
//                     return;
//                 }
//                 if (obj.Result == "SEGMENT ORDER") {
//                     alert($.i18n.prop("error.SEGMENTORDER"));
//                     return;
//                 }
//                 if (obj.Result == "BUNDLING NOT SUPPORTED") {
//                     alert($.i18n.prop("error.BUNDLINGNOTSUPPORTED"));
//                     return;
//                 }
//                 if (obj.Result == "OP PARTIAL FAILURE") {
//                     alert($.i18n.prop("error.porttrigger.OPPARTIALFAILURE"));
//                     return;
//                 }
//                 if (obj.Result == "SUCCESS") {

//                         alert($.i18n.prop("success.message"));
//                         location.reload();

//                 } else {
//                     alert(obj.result);
//                     return;
//                 }

//             },
//             error: function (xhr, textStatus, errorThrown) {
//                 //$.LoadingOverlay("hide");
//                 // clearSession();
//                 //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
//             }
//         });
//     }
// }

function ConfirmDeletePortTrigger(i) {
    $("#Port_i").val(i);
    $('#deletePortTrigger').modal('show');
}

function DeletePortTrigger() {
    var i = $("#Port_i").val();
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var temp = $("#Port_List").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AddPortTriggerEntry",                 
            type: "2",
            trigger_port: entries.trigger_port,
            trigger_port_end: entries.trigger_port_end,
            trigger_proto: entries.trigger_proto,
            income_port: entries.income_port,
            income_port_end: entries.income_port_end,
            income_proto: entries.income_proto,
            name: entries.name,
            token: session_token,
        },
        dataType: "text",
        success: function (msgs) {
            $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.Result == "NO EFFECT") {
                alert($.i18n.prop("error.NOEFFECT"));
                return;
            }
            if (obj.Result == "INFO UNAVAILABLE") {
                alert($.i18n.prop("error.INFOUNAVAILABLE"));
                return;
            }
            if (obj.Result == "SEGMENT TOO LONG") {
                alert($.i18n.prop("error.SEGMENTTOOLONG"));
                return;
            }
            if (obj.Result == "SEGMENT ORDER") {
                alert($.i18n.prop("error.SEGMENTORDER"));
                return;
            }
            if (obj.Result == "BUNDLING NOT SUPPORTED") {
                alert($.i18n.prop("error.BUNDLINGNOTSUPPORTED"));
                return;
            }

            if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

            } else {
                alert(obj.result);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function ConfirmEditPortTrigger(i) {
    var temp = $("#Port_List").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    //$("#APNID").val(entries.ID);
    //var edit_ipversion = entries.ipversion;
    switch (entries.edit_trigger_proto) {
        case "6":
            $("#edit_trigger_proto option[value=6]").prop('selected', true);
            break;
        case "17":
            $("#edit_trigger_proto option[value=17]").prop('selected', true);
            break;
        case "253":
            $("#edit_trigger_proto option[value=253]").prop('selected', true);
            break;
    }
    switch (entries.edit_income_proto) {
        case "6":
            $("#edit_income_proto option[value=6]").prop('selected', true);
            break;
        case "17":
            $("#edit_income_proto option[value=17]").prop('selected', true);
            break;
        case "253":
            $("#edit_income_proto option[value=253]").prop('selected', true);
            break;
    }

    var income_port;
    if( entries.income_port != entries.income_port_end) {
        income_port = entries.income_port + '-' + entries.income_port_end
    }else {
        income_port = entries.income_port
    }

    $("#edit_name").val(entries.name);
    $("#edit_trigger_port").val(entries.trigger_port);
    $("#edit_trigger_proto").val(entries.trigger_proto);
    $("#edit_income_port").val(income_port);
    $("#edit_income_proto").val(entries.income_proto);

    $("#OLD_name").val(entries.name);
    $("#OLD_trigger_port").val(entries.trigger_port);
    $("#OLD_trigger_port_end").val(entries.trigger_port_end);
    $("#OLD_trigger_proto").val(entries.trigger_proto);
    $("#OLD_income_port").val(entries.income_port);
    $("#OLD_income_port_end").val(entries.income_port_end);
    $("#OLD_income_proto").val(entries.income_proto);

    $('#editPortTrigger').modal('show');
}


function EditPortTrigger() {
    var edit_name = $("#edit_name").val();
    var edit_trigger_port = $("#edit_trigger_port").val();
    var edit_trigger_proto = $("#edit_trigger_proto").val();
    var edit_income_port = $("#edit_income_port").val();
    var edit_income_proto = $("#edit_income_proto").val();

    var old_name = $("#OLD_name").val();
    var old_trigger_port = $("#OLD_trigger_port").val();
    var old_trigger_port_end = $("#OLD_trigger_port_end").val();
    var old_trigger_proto = $("#OLD_trigger_proto").val();
    var old_income_port = $("#OLD_income_port").val();
    var old_income_port_end = $("#OLD_income_port_end").val();
    var old_income_proto = $("#OLD_income_proto").val();

    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var flag = editPortTrigger_check();
    //var flag = true;
    if (flag) {
        $.LoadingOverlay("show");
        var checkPortAny = checkPortIsAny('edit_income_port');
        var checkPortRange = checkPortIsRange('edit_income_port');
        var income_port, income_port_end;
        if(checkPortAny) {
            income_port = 1;
            income_port_end = 65535; 
        }else if(checkPortRange) {
            var temp = $("#edit_income_port").val().split("-");
            income_port = parseInt(temp[0]);
            income_port_end = parseInt(temp[1]);    
        }else {
            income_port = $("#edit_income_port").val();
            income_port_end = $("#edit_income_port").val()
        }

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "AddPortTriggerEntry",
                type: 3,
                tri_port_new: edit_trigger_port,
                tri_port_end_new: edit_trigger_port,
                tri_proto_new: edit_trigger_proto,
                inc_port_new: income_port,
                inc_port_end_new: income_port_end,
                inc_proto_new: edit_income_proto,
                name_new: edit_name,
                tri_port: old_trigger_port,
                tri_port_end: old_trigger_port_end,
                tri_proto: old_trigger_proto,
                inc_port: old_income_port,
                inc_port_end: old_income_port_end,
                inc_proto: old_income_proto,
                name:old_name,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "NO EFFECT") {
                    alert($.i18n.prop("error.NOEFFECT"));
                    return;
                }
                if (obj.Result == "INFO UNAVAILABLE") {
                    alert($.i18n.prop("error.INFOUNAVAILABLE"));
                    return;
                }
                if (obj.Result == "SEGMENT TOO LONG") {
                    alert($.i18n.prop("error.SEGMENTTOOLONG"));
                    return;
                }
                if (obj.Result == "SEGMENT ORDER") {
                    alert($.i18n.prop("error.SEGMENTORDER"));
                    return;
                }
                if (obj.Result == "BUNDLING NOT SUPPORTED") {
                    alert($.i18n.prop("error.BUNDLINGNOTSUPPORTED"));
                    return;
                }
                if (obj.Result == "OP PARTIAL FAILURE") {
                    alert($.i18n.prop("error.porttrigger.OPPARTIALFAILURE"));
                    return;
                }
                if (obj.Result == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    location.reload();

                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}


function GetDownloaLocalProgress()
{
    $("#confirmStartToUpload").modal("hide");
    var progress;
    $.ajax({
      type: "GET",
      url: "progress?X-Progress-ID=a2345678901234567890123456789012",
      dataType: "xml",
      cache: false,
      success: function (xml) {
        var size = $(xml).find("size").text();
        var received = $(xml).find("received").text();
        console.log("size:"+size)
        console.log("received:"+received);
        // progress = {
        //     sizex:size,
        //     received:received
        // };
        // console.log(progress);
        if(size>0)
        {
            //$("#local_progress_title").html("<span data-locale='softwareUpdate.Updatefirmware_ing'>"+ $.i18n.prop("softwareUpdate.Updatefirmware_ing") +"</span>");
            //console.log('size>0')
            var percent =  Math.round(received/size * 100);
            if(size == received)
            {
                //show processing
                $('#local_progress').attr('style', 'width: 100%;');
                //$("#local_progress_title").html("Processing");
            }
            else
            {
                $('#local_progress').attr('style', 'width: ' + percent + '%;');
            }           
        }
        else
        {
            console.log('no size')
            DownloadLocalProgressInterval = window.clearInterval(DownloadLocalProgressInterval);
            $("#DownloadLocalProgress").modal("hide");
        }
            
      },
      error: function (xhr, textStatus, errorThrown) {
            console.log('no size')
            DownloadLocalProgressInterval = window.clearInterval(DownloadLocalProgressInterval);
            $("#DownloadLocalProgress").modal("hide");
      }      
    });    
}

function CheckDownloaLocalProgress()
{
    $.ajax({
      type: "GET",
      url: "progress?X-Progress-ID=a2345678901234567890123456789012",
      dataType: "xml",
      cache: false,
      success: function (xml) {
        var size = $(xml).find("size").text();
        var received = $(xml).find("received").text();
        if(size>0)
        {
            GetDownloadLocalProgressModal();          
        }            
      }
    });    
}

function addPortTrigger_check() {

        if (!checkNameStringType3("name", 1, 32, $.i18n.prop("lan.port.trigger.UsePortTrigger.RuleName"))) {
            return false;
        } 
        else if (!checkPortIsInt("trigger_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.TriggerPort"))) {
            return false;
        } else if (!ValidateTCPUDPPort("income_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.OpenPort"))) {
            return false;
        } else {
            return true;
        }
  
        // if (!checkNameStringType3("name", 1, 32, $.i18n.prop("lan.port.trigger.UsePortTrigger.RuleName"))) {
        //     return false;
        // } 
        // else if (!ValidateTCPUDPPort("trigger_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.TriggerPort"))) {
        //     return false;
        // } else if (!checkPortIsInt("income_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.OpenPort"))) {
        //     return false;
        // } else {
        //     return true;
        // }        

}

function editPortTrigger_check() {

    if (!checkNameStringType3("edit_name", 1, 32, $.i18n.prop("lan.port.trigger.UsePortTrigger.RuleName"))) {
        return false;
    } 
    else if (!ValidateTCPUDPPort("edit_income_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.TriggerPort"))) {
        return false;
    } else if (!checkPortIsInt("edit_trigger_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.OpenPort"))) {
        return false;
    } else {
        return true;
    }

    // if (!checkNameStringType3("edit_name", 1, 32, $.i18n.prop("lan.port.trigger.UsePortTrigger.RuleName"))) {
    //     return false;
    // } 
    // else if (!ValidateTCPUDPPort("edit_trigger_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.TriggerPort"))) {
    //     return false;
    // } else if (!checkPortIsInt("edit_income_port", $.i18n.prop("lan.port.trigger.UsePortTrigger.OpenPort"))) {
    //     return false;
    // } else {
    //     return true;
    // }
}

function addReserveIPAddressModal() {
    var ReservedIPList_Total = $("#ReservedIPList_Total").val()
    if(ReservedIPList_Total>=30) {
        alert($.i18n.prop("lan.wifi.dhcp.path.maxReservedIPaddress"))
        flag1 = false;
    }
    else {    
        $("#Text_RESERVE_START_IP_3").val('');
        $("#Text_RESERVE_START_IP_4").val('');
        $('input[name="mac1[]"]').each(function () {
        $(this).val('');
        })    
        $("#addReserveIPAddress").modal('show');
    }
}

function addReserveIPAddress_check(macaddress) {
        var flag1 = false;
        var ReservedIPList=[];
        var temp = $("#ReservedIPList").val();
        if(temp != '') {
            ReservedIPList = JSON.parse(temp);
        }
        var fullregexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
        var findMacaddress = findip = -1;
        var ipaddress= '192.168.'+ $("#Text_RESERVE_START_IP_3").val() + '.'+ $("#Text_RESERVE_START_IP_4").val()
        if(ReservedIPList.length>0) { 
           // var findMacaddress = -1;
            ReservedIPList.some(function(el, i) {
                if (el.mac == macaddress) {
                    findMacaddress = i;
                    return true;
                }
            });     
            ReservedIPList.some(function(el, i) {
                if (el.reserved_ip == ipaddress) {
                    findip = i;
                    return true;
                }
            });
            //findMacaddress = ReservedIPList.findIndex(x => x.mac == macaddress);
            //findip = ReservedIPList.findIndex(x => x.reserved_ip == ipaddress);
        }
       

        if (!ValidateReserveIPV4("Text_RESERVE_START_IP_3", $.i18n.prop("lan.wifi.dhcp.path.IPAddress"))) {
            flag1 = false;    
        }
        else if (!ValidateReserveIPV4("Text_RESERVE_START_IP_4", $.i18n.prop("lan.wifi.dhcp.path.IPAddress"))) {
            flag1 = false;    
        }   
        else if(findip >= 0) 
        {
            alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"))
            // $("#macid1").focus();
            flag1 = false;                
        }
        else if (!fullregexp.test(macaddress)) {
            alert($.i18n.prop("home.MACAddress")+ $.i18n.prop("error.macaddressformat"))
            // $("#macid1").focus();
            flag1 = false;
        } 
        else if(findMacaddress >= 0) 
        {
            alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"))
            // $("#macid1").focus();
            flag1 = false;                
        }
        else {
            flag1 = true;
        }
    return flag1
}

function addReserveIPAddressConfirm() {
    
    var mac1address = "";
    $('input[name="mac1[]"]').each(function () {
        mac1address += $(this).val() + ':';
    })
    mac1address = mac1address.substring(0, mac1address.length - 1);
    var flag = addReserveIPAddress_check(mac1address);
    if(flag) {

        $("#addReserveIPAddress").modal('hide');
        $("#addReserveIPAddressConfirmModal").modal('show');
    }

}

function addReserveIPAddress() {
    $("#addReserveIPAddressConfirmModal").modal('hide');        
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";   
    var mac1address = "";
    $('input[name="mac1[]"]').each(function () {
        mac1address += $(this).val() + ':';
    })
    mac1address = mac1address.substring(0, mac1address.length - 1);
    var Text_RESERVE_START_IP_3 = $("#Text_RESERVE_START_IP_3").val()
    var Text_RESERVE_START_IP_4 = $("#Text_RESERVE_START_IP_4").val()
    var reserved_ip = '192.168.'+Text_RESERVE_START_IP_3+'.'+Text_RESERVE_START_IP_4
    // var pkts_allowed = $("#pkts_allowed").val();
    var flag = addReserveIPAddress_check(mac1address);
    // var flag = false
    if(flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "AddDHCPReservation",                 
                type: "1",
                ip_addr: "",
                mac_addr: mac1address,
                reserved_ip: reserved_ip,
                dev_name: "",
                enable: 1,
                token: session_token,
            },
            dataType: "text",
            success: function (msgs) {
                // $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.result == "INSUFFICIENT RESOURCES") {
                    $.LoadingOverlay("hide");
                    //The max number of Reserved IP address is 30
                    // $("#addReserveIPAddress").modal('show');
                    //$("#addReserveIPAddressConfirmModal").modal('hide');                      
                    alert($.i18n.prop("lan.wifi.dhcp.path.maxReservedIPaddress"));
                    return;
                }
                if (obj.result == "INVALID ARG") {
                    $.LoadingOverlay("hide");
                    //Reserved IP address duplicated with existing one. Please check again.
                    $("#addReserveIPAddress").modal('show');
                    // $("#addReserveIPAddressConfirmModal").modal('hide');                    
                    alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"));
                    return;
                }
                if (obj.result == "INVALID OPERATION") {
                    $.LoadingOverlay("hide");
                    //Reserved IP address duplicated with existing one. Please check again.
                    $("#addReserveIPAddress").modal('show');
                    // $("#addReserveIPAddressConfirmModal").modal('hide');                    
                    alert($.i18n.prop("error.ReservedIPaddressoutofrange"));
                    return;
                }                
                if (obj.result == "SUCCESS") {
                    SetActivateLAN();
                } else {
                    $.LoadingOverlay("hide");
                    alert(obj.result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                // clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetDHCPReservations() {
    var Error_Msg = "";
    var card = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetDHCPReservations",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                //clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            //if (obj.GetGlobalWifiResult == "SUCCESS") {
                if (obj.dhcp_count >=1) {
                    var mac, reserved_ip;
                    $("#ReservedIPList").val(JSON.stringify(obj.entries));
                    $("#ReservedIPList_Total").val(obj.dhcp_count)
    
                    for (i = 0; i < obj.dhcp_count; i++) {
                        mac = obj.entries[i].mac;
                        reserved_ip = obj.entries[i].reserved_ip;
                        
                        card += '<div class="col-12 col-md-12 col-lg-12 text-center mb-2">'+
                        '<div class="flex">'+
                          '<div class="flex-2">'+
                            '<div class="row flex-item-center">'+
                              '<div class="text-left col-12 col-sm-3 col-md-5 col-lg-5">'+
                                '<small class="card-title-font"><span data-locale="lan.wifi.dhcp.path.IPAddress">' + $.i18n.prop("lan.wifi.dhcp.path.IPAddress") + '</span></small>'+
                                '<dt class="card-empty-font">'+ reserved_ip +'</dt>'+
                              '</div>'+
                              '<div class="text-left col-12 col-sm-4 col-md-7 col-lg-7">'+
                                '<small class="card-title-font"><span data-locale="lan.wifi.dhcp.path.MACAddress">' + $.i18n.prop("lan.wifi.dhcp.path.MACAddress") + '</span></small>'+
                                '<dt class="card-empty-font">'+ mac +'</dt>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                          '<div class="item ">'+
                            '<div class="row flex-item-center ">'+
                              '<div class="col-12 col-md-12 col-lg-12 col-sm-12">'+
                                '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmDeleteReserveIP(\'' + i + '\')"" >'+
                                  '<img alt="image" src="assets/img/5g_content/ic_card_footer_delete.svg">'+
                                  '<span data-locale="common.Delete">' + $.i18n.prop("common.Delete") + '</span>'+
                                '</button>'+
                                '<button class="btn btn-icon icon-left card-edit-font kitty_lock" onclick="ConfirmEditReserveIP(\'' + i + '\')"">'+
                                  '<img alt="image" src="assets/img/5g_content/ic_card_footer_edit.svg">'+
                                  '<span data-locale="common.Edit">' + $.i18n.prop("common.Edit") + '</span>'+
                                '</button>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'

                    }
                    if (card != "") {
                        $("#card").html(card);
                    }
                    console.log('card:'+card)
                    //KittyLock    
                }
            
            




        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });


}

function ConfirmDeleteReserveIP(i) {
    $("#ReservedIPList_i").val(i);
    $('#deleteReservedIPList').modal('show');
}

function deleteReserveIPAddressConfirm() {
    $("#deleteReservedIPList").modal('hide')
    $("#deleteReserveIPAddressConfirmModal").modal('show')
}

function DeleteReserveIP() {
    var i = $("#ReservedIPList_i").val();
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }

    var temp = $("#ReservedIPList").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];
    $.LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "AddDHCPReservation",                 
            type: "2",
            ip_addr: entries.reserved_ip,
            mac_addr: "",
            reserved_ip: "",
            dev_name: "",
            enable: 1,
            token: session_token,
        },
        dataType: "text",
        success: function (msgs) {
            // $.LoadingOverlay("hide");
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.result == "INSUFFICIENT RESOURCES") {
                $.LoadingOverlay("hide");
                //The max number of Reserved IP address is 30              
                alert($.i18n.prop("lan.wifi.dhcp.path.maxReservedIPaddress"));
                return;
            }
            if (obj.result == "INVALID ARG") {
                $.LoadingOverlay("hide");
                //Reserved IP address duplicated with existing one. Please check again.                 
                alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"));
                return;
            }
            if (obj.result == "SUCCESS") {
                SetActivateLAN()
                    // alert($.i18n.prop("success.message"));
                    // location.reload();

            } else {
                alert(obj.result);
                return;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$.LoadingOverlay("hide");
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}

function ConfirmEditReserveIP(i) {
    var temp = $("#ReservedIPList").val();
    var obj = JSON.parse(temp);
    var entries = obj[i];

    var edit_mac = entries.mac;
    var tempMac = edit_mac.split(':');
    // $("#editMacID").val(id);
    $("#mac_p1").val(tempMac[0]);
    $("#mac_p2").val(tempMac[1]);
    $("#mac_p3").val(tempMac[2]);
    $("#mac_p4").val(tempMac[3]);
    $("#mac_p5").val(tempMac[4]);
    $("#mac_p6").val(tempMac[5]);   
    
    var reserved_ip = entries.reserved_ip;
    var tempReserveIP = reserved_ip.split('.');
    $("#Edit_Text_RESERVE_START_IP_3").val(tempReserveIP[2])
    $("#Edit_Text_RESERVE_START_IP_4").val(tempReserveIP[3])
    $("#OLD_ip_addr").val(reserved_ip)
    $("#OLD_macaddress").val(edit_mac)

    $('#editReserveIPAddress').modal('show');
}

function editReserveIPAddressConfirm() {
    var mac1address = "";
    $('input[name="edit_mac1[]"]').each(function () {
        mac1address += $(this).val() + ':';
    })
    mac1address = mac1address.substring(0, mac1address.length - 1);
    var flag = editReserveIPAddress_check(mac1address);
    if(flag) {

        $("#editReserveIPAddress").modal('hide');
        $("#editReserveIPAddressConfirmModal").modal('show');
    }
}

function editReserveIPAddress_check(macaddress) {
    var flag1 = false
    
    var OLD_ip_addr = $("#OLD_ip_addr").val()
    var OLD_macaddress = $("#OLD_macaddress").val()
    var temp = $("#ReservedIPList").val()
    var ReservedIPList = JSON.parse(temp);
    var fullregexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    var findMacaddress = findip = -1;
    //findMacaddress = ReservedIPList.findIndex(x => x.mac == macaddress);
    
    var ipaddress= '192.168.'+ $("#Edit_Text_RESERVE_START_IP_3").val() + '.'+ $("#Edit_Text_RESERVE_START_IP_4").val()
    //findip = ReservedIPList.findIndex(x => x.reserved_ip == ipaddress); 


    ReservedIPList.some(function(el, i) {
        if (el.mac == macaddress) {
            findMacaddress = i;
            return true;
        }
    });     
    ReservedIPList.some(function(el, i) {
        if (el.reserved_ip == ipaddress) {
            findip = i;
            return true;
        }
    });

    if (!ValidateReserveIPV4("Edit_Text_RESERVE_START_IP_3", $.i18n.prop("lan.wifi.dhcp.path.IPAddress"))) {
        flag1 = false;    
    }
    else if (!ValidateReserveIPV4("Edit_Text_RESERVE_START_IP_4", $.i18n.prop("lan.wifi.dhcp.path.IPAddress"))) {
        flag1 = false;    
    }   
    else if(findip >= 0 && ipaddress != OLD_ip_addr) 
    {
        alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"))
        // $("#macid1").focus();
        flag1 = false;                
    }
    else if (!fullregexp.test(macaddress)) {
        alert($.i18n.prop("home.MACAddress")+ $.i18n.prop("error.macaddressformat"))
        // $("#macid1").focus();
        flag1 = false;
    } 
    else if(findMacaddress >= 0 && macaddress != OLD_macaddress) 
    {
        alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"))
        // $("#macid1").focus();
        flag1 = false;                
    }
    else {
        flag1 = true;
    }
    return flag1
}

function editReserveIPAddress() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";   
    var mac1address = "";
    $('input[name="edit_mac1[]"]').each(function () {
        mac1address += $(this).val() + ':';
    })
    mac1address = mac1address.substring(0, mac1address.length - 1);
    var Text_RESERVE_START_IP_3 = $("#Edit_Text_RESERVE_START_IP_3").val();
    var Text_RESERVE_START_IP_4 = $("#Edit_Text_RESERVE_START_IP_4").val();
    var reserved_ip = '192.168.'+Text_RESERVE_START_IP_3+'.'+Text_RESERVE_START_IP_4;
    var OLD_ip_addr = $("#OLD_ip_addr").val()
    var OLD_macaddress = $("#OLD_macaddress").val()
    var edit_reserved_ip = edit_mac_addr = '';
    if(reserved_ip != OLD_ip_addr) {
        edit_reserved_ip = reserved_ip
    }
    if(mac1address != OLD_macaddress) {
        edit_mac_addr = mac1address
    }
    // var pkts_allowed = $("#pkts_allowed").val();
    var flag = editReserveIPAddress_check(mac1address);
    // var flag = false
    if(flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "AddDHCPReservation",                 
                type: "3",
                ip_addr: OLD_ip_addr,
                mac_addr: edit_mac_addr,
                reserved_ip: edit_reserved_ip,
                dev_name: "",
                enable: 1,
                token: session_token,
            },
            dataType: "text",
            success: function (msgs) {
                // $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.result == "INSUFFICIENT RESOURCES") {
                    $.LoadingOverlay("hide");
                    //The max number of Reserved IP address is 30
                    $("#editReserveIPAddress").modal('show');
                    $("#editReserveIPAddressConfirmModal").modal('hide');                      
                    alert($.i18n.prop("lan.wifi.dhcp.path.maxReservedIPaddress"));
                    return;
                }
                if (obj.result == "INVALID ARG") {
                    $.LoadingOverlay("hide");
                    //Reserved IP address duplicated with existing one. Please check again.
                    $("#editReserveIPAddress").modal('show');
                    $("#editReserveIPAddressConfirmModal").modal('hide');                    
                    alert($.i18n.prop("lan.wifi.dhcp.path.ReservedIPaddressDuplicated"));
                    return;
                }
                if (obj.result == "SUCCESS") {
                    SetActivateLAN();
                } else {
                    $.LoadingOverlay("hide");
                    alert(obj.result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                // clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetNatSettings() {
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetNatSettings",
            mask: "543",
            nattype: "99",
            nattype_result: "0",
            dmz: "",
            dmz_result: "0",
            ipsec: "99",
            ipsec_result: "0",
            pptp: "99",
            pptp_result: "0",
            l2tp: "99",
            l2tp_result: "0",
            gen_timeout: "",
            get_timeout_result: "0",
            icmp_timeout: "",
            icmp_timeout_result: "0",
            tcp_timeout: "",
            tcp_timeout_result: "0",
            udp_timeout: "",
            udp_timeout_result: "0",
            wwan_access: "99",
            wwan_access_result: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.nattype_result == "SUCCESS") {
                    
                    if (obj.nattype == "2") {
                        $("#nattype option[value=2]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('on');
                    } else if (obj.nattype == "0") {
                        $("#nattype option[value=0]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('off');
                    }
                    $("#tcp_timeout").val(obj.tcp_timeout);
                    $("#udp_timeout").val(obj.udp_timeout);
                    $("#nat_settings").val(JSON.stringify(obj));
                    //KittyLock
                    // findKittyKey('Upnp', 'Select_UPNP_EN_DS');
                    // findKittyKey('Upnp', 'upnp_lock');
                }
                
            }
        }
    });

}

function SetNatSettings() {
    
    var nat_settings = JSON.parse($("#nat_settings").val());
    var flag = validateNAT_check();
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetNatSettings",
                mask: "385",
                nattype: $("#nattype").val(),
                nattype_result: "0",
                dmz: nat_settings.dmzip,
                dmz_result: "0",
                ipsec: nat_settings.ipsec,
                ipsec_result: "0",
                pptp: nat_settings.pptp,
                pptp_result: "0",
                l2tp:  nat_settings.l2tp,
                l2tp_result: "0",
                gen_timeout: nat_settings.gen_timeout,
                get_timeout_result: "0",
                icmp_timeout: nat_settings.icmp_timeout,
                icmp_timeout_result: "0",
                tcp_timeout: $("#tcp_timeout").val(),
                tcp_timeout_result: "0",
                udp_timeout: $("#udp_timeout").val(),
                udp_timeout_result: "0",
                wwan_access: nat_settings.wwan_access,
                wwan_access_result: "0",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                if (msgs.length > 0) {
                    var obj = jQuery.parseJSON(msgs);
                    if (obj.result == "AUTH_FAIL") {
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                    }
                    if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                    }
                    if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                    }
                    if (obj.tcp_timeout_result == "SUCCESS") {
                        
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    }
                    
                }
            }
        });
    }
}

function validateNAT_check()
{
    if (!ValidateInputValue("tcp_timeout", 30, 86400, $.i18n.prop("setting.nat.TCPNATTimer"))) {
        return ;
    } else if (!ValidateInputValue("udp_timeout", 30, 86400, $.i18n.prop("setting.nat.UDPNATTimer"))) {
        return ;
    } else {
        return true;
    }    
}

function GetVPNSettings() {
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetNatSettings",
            mask: "543",
            nattype: "99",
            nattype_result: "0",
            dmz: "",
            dmz_result: "0",
            ipsec: "99",
            ipsec_result: "0",
            pptp: "99",
            pptp_result: "0",
            l2tp: "99",
            l2tp_result: "0",
            gen_timeout: "",
            get_timeout_result: "0",
            icmp_timeout: "",
            icmp_timeout_result: "0",
            tcp_timeout: "",
            tcp_timeout_result: "0",
            udp_timeout: "",
            udp_timeout_result: "0",
            wwan_access: "99",
            wwan_access_result: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.pptp_result == "SUCCESS") {
                    
                    if (obj.pptp == "1") {
                        $("#pptp option[value=1]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('on');
                    } else if (obj.pptp == "0") {
                        $("#pptp option[value=0]").prop('selected', true);
                        //$('#Select_UPNP_EN_DS').bootstrapToggle('off');
                    }
                    $("#nat_settings").val(JSON.stringify(obj));
                    //KittyLock
                    // findKittyKey('Upnp', 'Select_UPNP_EN_DS');
                    // findKittyKey('Upnp', 'upnp_lock');
                }
                
            }
        }
    });

}

function SetVPNSettings() {
    $.LoadingOverlay("show");
    var nat_settings = JSON.parse($("#nat_settings").val());
    var flag = true;
    if (flag) {
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetNatSettings",
                mask: "24",
                nattype: nat_settings.nattype,
                nattype_result: "0",
                dmz: nat_settings.dmzip,
                dmz_result: "0",
                ipsec: nat_settings.ipsec,
                ipsec_result: "0",
                pptp: $("#pptp").val(),
                pptp_result: "0",
                l2tp: $("#pptp").val(),
                l2tp_result: "0",
                gen_timeout: nat_settings.gen_timeout,
                get_timeout_result: "0",
                icmp_timeout: nat_settings.icmp_timeout,
                icmp_timeout_result: "0",
                tcp_timeout: nat_settings.tcp_timeout,
                tcp_timeout_result: "0",
                udp_timeout: nat_settings.udp_timeout,
                udp_timeout_result: "0",
                wwan_access: nat_settings.wwan_access,
                wwan_access_result: "0",
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                if (msgs.length > 0) {
                    var obj = jQuery.parseJSON(msgs);
                    if (obj.result == "AUTH_FAIL") {
                        clearSession();
                        alert($.i18n.prop("error.AUTH_FAIL"));
                        return;
                    }
                    if (obj.result == "Token_mismatch") {
                        clearSession();
                        alert($.i18n.prop("error.Token_mismatch"));
                        return;
                    }
                    if (obj.result == "QTApp_Login") {
                        clearSession();
                        alert($.i18n.prop("common.Routerdeviceinuse"));
                        return;
                    }
                    if (obj.pptp_result == "SUCCESS") {
                        
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    }
                    
                }
            }
        });
    }
}


//
function SetBasicWifiAPConfigAtBasic(dfs) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    if(!dfs) dfs = false;

    var Error_Msg = "";
    var wifi_status = "";
    var SSID_A_Mode = $("#Select_ModeA").val();
    var SSID_A_Name = $("#SSID_A_Name").val();
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_A_Password = $("#SSID_A_Password").val();
    var SSID_A_Stealth;
    var SSID_A_Privacy;
    var SSID_A_Max_Client = $("#SSID_A_Max_Client").val();
    var SSID_B_Status;
    var SSID_B_Mode = $("#Select_ModeB").val();
    var SSID_B_Name = $("#SSID_B_Name").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var SSID_B_Password = $("#SSID_B_Password").val();
    var SSID_B_Stealth;
    var SSID_B_Privacy;
    var SSID_B_Max_Client = $("#SSID_B_Max_Client").val();
    var SSID_B_AccessWeb;
    var SSID_A_PMF;
    var SSID_B_PMF;

    // if (SSID_A_Security == '0' || SSID_A_Security == '5' || SSID_B_Security == '0' || SSID_B_Security == '5') {
    //     $("#confirmOpen").modal('show');
    //     return;
    // }

    SSID_B_Status = $("#SSID_B_Status").val();
    // if ($("#SSID_B_Status").prop('checked')) {
    //   SSID_B_Status = 1;
    // } else {
    //   SSID_B_Status = 0;
    // }

    SSID_B_AccessWeb = $("#SSID_B_AccessWeb").val();
    // if ($("#SSID_B_AccessWeb").prop('checked')) {
    //   SSID_B_AccessWeb = 1;
    // } else {
    //   SSID_B_AccessWeb = 0;
    // }

    SSID_A_Stealth = $("#Select_SSID_A_Stealth").val();
    // if ($("#Select_SSID_A_Stealth").prop('checked')) {
    //   SSID_A_Stealth = 1;
    // } else {
    //   SSID_A_Stealth = 0;
    // }

    SSID_A_Privacy = $("#Select_SSID_A_Privacy").val();
    // if ($("#Select_SSID_A_Privacy").prop('checked')) {
    //   SSID_A_Privacy = 1;
    // } else {
    //   SSID_A_Privacy = 0;
    // }

    SSID_B_Stealth = $("#Select_SSID_B_Stealth").val();
    // if ($("#Select_SSID_B_Stealth").prop('checked')) {
    //   SSID_B_Stealth = 1;
    // } else {
    //   SSID_B_Stealth = 0;
    // }

    SSID_B_Privacy = $("#Select_SSID_B_Privacy").val();
    // if ($("#Select_SSID_B_Privacy").prop('checked')) {
    //   SSID_B_Privacy = 1;
    // } else {
    //   SSID_B_Privacy = 0;
    // }

    SSID_A_PMF = $("#Select_SSID_A_PMF").val();
    // if ($("#Select_SSID_A_PMF").prop('checked')) {
    //   SSID_A_PMF = 2;
    // } else {
    //   SSID_A_PMF = 0;
    // }  

    SSID_B_PMF = $("#Select_SSID_B_PMF").val();
    // if ($("#Select_SSID_B_PMF").prop('checked')) {
    //   SSID_B_PMF = 2;
    // } else {
    //   SSID_B_PMF = 0;
    // }  

    var form = {
        Page: "SetBasicWifiAPConfig",
        SSID_A_Name: SSID_A_Name,
        SSID_A_Mode: SSID_A_Mode,
        SSID_A_Security: SSID_A_Security,
        SSID_A_Password: SSID_A_Password,
        SSID_A_Stealth: SSID_A_Stealth,
        SSID_A_Privacy: SSID_A_Privacy,
        SSID_A_Max_Client: SSID_A_Max_Client,
        SSID_A_PMF: SSID_A_PMF,
        SSID_B_Name: SSID_B_Name,
        SSID_B_Mode: SSID_B_Mode,
        SSID_B_Status: SSID_B_Status,
        SSID_B_Security: SSID_B_Security,
        SSID_B_Password: SSID_B_Password,
        SSID_B_Stealth: SSID_B_Stealth,
        SSID_B_Privacy: SSID_B_Privacy,
        SSID_B_Max_Client: SSID_B_Max_Client,
        SSID_B_PMF: SSID_B_PMF,
        SSID_B_AccessWeb: SSID_B_AccessWeb,
        token: session_token
    };

    console.log(JSON.stringify(form))

    var flag = SetBasicWifiAPConfig_check();
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetBasicWifiAPConfig",
                SSID_A_Name: SSID_A_Name,
                SSID_A_Mode: SSID_A_Mode,
                SSID_A_Security: SSID_A_Security,
                SSID_A_Password: SSID_A_Password,
                SSID_A_Stealth: SSID_A_Stealth,
                SSID_A_Privacy: SSID_A_Privacy,
                SSID_A_Max_Client: SSID_A_Max_Client,
                SSID_A_PMF: SSID_A_PMF,             
                SSID_B_Name: SSID_B_Name,
                SSID_B_Mode: SSID_B_Mode,
                SSID_B_Status: SSID_B_Status,
                SSID_B_Security: SSID_B_Security,
                SSID_B_Password: SSID_B_Password,
                SSID_B_Stealth: SSID_B_Stealth,
                SSID_B_Privacy: SSID_B_Privacy,
                SSID_B_Max_Client: SSID_B_Max_Client, 
                SSID_B_PMF: SSID_B_PMF,
                SSID_B_AccessWeb: SSID_B_AccessWeb,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Wifi_Basic_Result == "SUCCESS") {

                    //alert('Success, now setting SetGlobalWifiConfig... ');
                    //location.reload();
                    //============!!!!!!
                    SetGlobalWifiConfigAtBasic(dfs)
                    //SetGlobalWifiConfig();
                } else {
                    alert(obj.Wifi_Basic_Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}


function SetGlobalWifiConfigAtBasic(dfs) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var ApMode, wifi_status, Select_Isolation, Channel24, Bandwidth24, Channel5, Bandwidth5, BandSelection5, TxPower;

    //$.LoadingOverlay("show");
    wifi_status = $("#Select_wifi_status").val();
    Select_Isolation = $("#Select_Isolation").val();

    ApMode = $("#Select_Multi").val();
    Channel24 = $("#Channel24").val();
    Bandwidth24 = $("#Bandwidth24").val();
    Channel5 = $("#Channel5").val();
    Bandwidth5 = $("#Bandwidth5").val();
    BandSelection5 = $("#BandSelection5").val();
    TxPower = $("#TxPower").val();
    
    
    var form = {
        Page: "SetGlobalWifiConfig",
        Status: wifi_status,
        ApMode: ApMode,
        Channel24: Channel24,
        Bandwidth24: Bandwidth24,
        Channel5: Channel5,
        Bandwidth5: Bandwidth5,
        BandSelection5: BandSelection5,
        Isolation: Select_Isolation,
        TxPower: TxPower,
        token: session_token
    };
    //$.LoadingOverlay("show");
    var flag = true;
    if (flag) {

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetGlobalWifiConfig",
                Status: wifi_status,
                ApMode: ApMode,
                Channel24: Channel24,
                Bandwidth24: Bandwidth24,
                Channel5: Channel5,
                Bandwidth5: Bandwidth5,
                BandSelection5: BandSelection5,
                Isolation: Select_Isolation,
                TxPower: TxPower,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                    alert($.i18n.prop("common.dfsNotAvailable"));
                    return;
                }  
                else if (obj.SetGlobalWifiResult == "SUCCESS") {
                    // alert($.i18n.prop("success.message"));
                    // if (Channel != '56') {
                    //     location.reload();
                    // }
                
                    if (!dfs) {
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    } else {
                        //setTimeout(function(){
                            $.LoadingOverlay("hide");
                            DFSCountdown();                            
                        //}, 2000);
                    }

                } else {
                    alert(obj.SetGlobalWifiResult);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function checkSetGlobalWifiConfigAtAdvanced() {
    var flag = SetGlobalWifiConfigAtAdvanced_check();
    if(flag) {
        var dfs = false;
        var bandSelection = ''
        $.each($("input[name='bandSelection']:checked"), function(){
            // bandSelection.push($(this).val());
            bandSelection += $(this).val()+'+';
        });
        if(bandSelection !=''){
            bandSelection = bandSelection.substring(0, bandSelection.length-1);
        }
        switch(bandSelection) {
            case "52":
                break;
            case "53":
                dfs = true;
                break;
            case "56":
                dfs = true;
                break;
            case "52+53":
                dfs = true;
                break;
            case "52+56":
                dfs = true;
                break;
            case "53+56":
                dfs = true;
                break;
            case "52+53+56":
                dfs = true;
                break;
        }
        if(dfs) {
            // Check Use Wifi is disabled
            var useWifi = $("#wifi_status").val();
            if(useWifi=="1") {
                //Check SSID A Wifi Mode or SSIB B Wifi Mode is 5GHz
                var SSID_A_Mode = $("#SSID_A_Mode").val();
                var SSID_B_Mode = $("#SSID_B_Mode").val();
                if(SSID_A_Mode=="a" || SSID_B_Mode=="a") {
                    dfs = true;
                }else {
                    dfs = false;
                }
            }else {
                dfs = false;
            }
        }

        if(!dfs) {
            //console.log('NO DFS')
            //excute Applying Disconnect process
            $("#DFS").val('false')
        }else {
            //console.log('DFSDFS')
            $("#DFS").val('true')
        }
        //excute Applying Disconnect process
        $("#applyWifiAdvanceDisconnectModal").modal("show");

    }
}

function setGlobalWifiConfigAtAdvanced() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var dfs = $("#DFS").val();
    var Error_Msg = "";
    var wifi_status, ApMode, Channel24, Bandwidth24, Channel5, Bandwidth5, BandSelection5, TxPower, Isolation;

    //$.LoadingOverlay("show");
    wifi_status = $("#wifi_status").val();
    ApMode = $("#ApMode").val();
    
    Channel24 = $("#Select_channel_2").val();
    Bandwidth24 = $("#Select_Bandwidth_2").val();
    Channel5 = $("#Select_channel_5").val();
    Bandwidth5 = $("#Select_Bandwidth_5").val();
    TxPower = $("#Select_TX").val();
    Isolation = $("#Isolation").val();
    var bandSelection = ''
    $.each($("input[name='bandSelection']:checked"), function(){
        // bandSelection.push($(this).val());
        bandSelection += $(this).val()+'+';
    });
    if(bandSelection !=''){
        bandSelection = bandSelection.substring(0, bandSelection.length-1);
    }
    switch(bandSelection) {
        case "52":
            BandSelection5 = 0;
            break;
        case "53":
            BandSelection5 = 1;
            break;
        case "56":
            BandSelection5 = 2;
            break;
        case "52+53":
            BandSelection5 = 3;
            break;
        case "52+56":
            BandSelection5 = 4;
            break;
        case "53+56":
            BandSelection5 = 5;
            break;
        case "52+53+56":
            BandSelection5 = 6;
            break;
    }
    var form = {
        Page: "SetGlobalWifiConfig",
        Status: wifi_status,
        ApMode: ApMode,
        Channel24: Channel24,
        Bandwidth24: Bandwidth24,
        Channel5: Channel5,
        Bandwidth5: Bandwidth5,
        BandSelection5: BandSelection5,
        Isolation: Isolation,
        TxPower: TxPower,
        token: session_token
    };
    console.log(JSON.stringify(form))    
    var flag = SetGlobalWifiConfigAtAdvanced_check();
    // flag = false;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetGlobalWifiConfig",
                Status: wifi_status,
                ApMode: ApMode,
                Channel24: Channel24,
                Bandwidth24: Bandwidth24,
                Channel5: Channel5,
                Bandwidth5: Bandwidth5,
                Bandselection5: BandSelection5,
                Isolation: Isolation,
                TxPower: TxPower,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                    alert($.i18n.prop("common.dfsNotAvailable"));
                    return;
                }  
                else if (obj.SetGlobalWifiResult == "SUCCESS") {
                    // alert($.i18n.prop("success.message"));
                    // if (Channel != '56') {
                    //     location.reload();
                    // }


                    if (dfs=='false') {
                        alert($.i18n.prop("success.message"));
                        location.reload();
                    } else {
                        $("#applyWifiAdvanceDisconnectModal").modal('hide');
                        $.LoadingOverlay("hide");
                        //console.log('DFSDFS');
                        // $("#confirmACNo").modal('show');
                        DFSCountdown();
                        
                    }

                } else {
                    alert(obj.SetGlobalWifiResult);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function SetGlobalWifiConfigAtAdvanced_check() {
    var bandSelection = []
    $.each($("input[name='bandSelection']:checked"), function(){
        bandSelection.push($(this).val())
    });
    if(bandSelection.length==0) {
        alert($.i18n.prop("error.WiFiBandSelection"));
        return false;
    }else {
        return true;
    }
}

function SetBasicWifiAPConfigCancelDFSAtBasic(dfs) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    if(!dfs) dfs = false;

    var Error_Msg = "";
    //if OLD_Select_wifi_status==disabled ==> disabled & 5G
    //if OLD_Select_wifi_status==enabled ==> enabled & 2.4G
    var OLD_Select_wifi_status = $("#OLD_Select_wifi_status").val();
    if(OLD_Select_wifi_status=="0") {
        var SSID_A_Mode = $("#Select_ModeA").val();
        var SSID_B_Mode = $("#Select_ModeB").val();
    }else {
        var SSID_A_Mode = 'g';
        var SSID_B_Mode = 'g';
    }
    //var SSID_A_Mode = 'g';
    var SSID_A_Name = $("#SSID_A_Name").val();
    var SSID_A_Security = $("#SSID_A_Security").val();
    var SSID_A_Password = $("#SSID_A_Password").val();
    var SSID_A_Stealth;
    var SSID_A_Privacy;
    var SSID_A_Max_Client = $("#SSID_A_Max_Client").val();
    var SSID_B_Status;
    //var SSID_B_Mode = 'g';
    var SSID_B_Name = $("#SSID_B_Name").val();
    var SSID_B_Security = $("#SSID_B_Security").val();
    var SSID_B_Password = $("#SSID_B_Password").val();
    var SSID_B_Stealth;
    var SSID_B_Privacy;
    var SSID_B_Max_Client = $("#SSID_B_Max_Client").val();
    var SSID_B_AccessWeb;
    var SSID_A_PMF;
    var SSID_B_PMF;

    // if (SSID_A_Security == '0' || SSID_A_Security == '5' || SSID_B_Security == '0' || SSID_B_Security == '5') {
    //     $("#confirmOpen").modal('show');
    //     return;
    // }

    SSID_B_Status = $("#SSID_B_Status").val();
    // if ($("#SSID_B_Status").prop('checked')) {
    //   SSID_B_Status = 1;
    // } else {
    //   SSID_B_Status = 0;
    // }

    SSID_B_AccessWeb = $("#SSID_B_AccessWeb").val();
    // if ($("#SSID_B_AccessWeb").prop('checked')) {
    //   SSID_B_AccessWeb = 1;
    // } else {
    //   SSID_B_AccessWeb = 0;
    // }

    SSID_A_Stealth = $("#Select_SSID_A_Stealth").val();
    // if ($("#Select_SSID_A_Stealth").prop('checked')) {
    //   SSID_A_Stealth = 1;
    // } else {
    //   SSID_A_Stealth = 0;
    // }

    SSID_A_Privacy = $("#Select_SSID_A_Privacy").val();
    // if ($("#Select_SSID_A_Privacy").prop('checked')) {
    //   SSID_A_Privacy = 1;
    // } else {
    //   SSID_A_Privacy = 0;
    // }

    SSID_B_Stealth = $("#Select_SSID_B_Stealth").val();
    // if ($("#Select_SSID_B_Stealth").prop('checked')) {
    //   SSID_B_Stealth = 1;
    // } else {
    //   SSID_B_Stealth = 0;
    // }

    SSID_B_Privacy = $("#Select_SSID_B_Privacy").val();
    // if ($("#Select_SSID_B_Privacy").prop('checked')) {
    //   SSID_B_Privacy = 1;
    // } else {
    //   SSID_B_Privacy = 0;
    // }

    SSID_A_PMF = $("#Select_SSID_A_PMF").val();
    // if ($("#Select_SSID_A_PMF").prop('checked')) {
    //   SSID_A_PMF = 2;
    // } else {
    //   SSID_A_PMF = 0;
    // }  

    SSID_B_PMF = $("#Select_SSID_B_PMF").val();
    // if ($("#Select_SSID_B_PMF").prop('checked')) {
    //   SSID_B_PMF = 2;
    // } else {
    //   SSID_B_PMF = 0;
    // }  

    var form = {
        Page: "SetBasicWifiAPConfig",
        SSID_A_Name: SSID_A_Name,
        SSID_A_Mode: SSID_A_Mode,
        SSID_A_Security: SSID_A_Security,
        SSID_A_Password: SSID_A_Password,
        SSID_A_Stealth: SSID_A_Stealth,
        SSID_A_Privacy: SSID_A_Privacy,
        SSID_A_Max_Client: SSID_A_Max_Client,
        SSID_A_PMF: SSID_A_PMF,
        SSID_B_Name: SSID_B_Name,
        SSID_B_Mode: SSID_B_Mode,
        SSID_B_Status: SSID_B_Status,
        SSID_B_Security: SSID_B_Security,
        SSID_B_Password: SSID_B_Password,
        SSID_B_Stealth: SSID_B_Stealth,
        SSID_B_Privacy: SSID_B_Privacy,
        SSID_B_Max_Client: SSID_B_Max_Client,
        SSID_B_PMF: SSID_B_PMF,
        SSID_B_AccessWeb: SSID_B_AccessWeb,
        token: session_token
    };

    console.log(JSON.stringify(form))

    var flag = SetBasicWifiAPConfig_check();
    //flag = false;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetBasicWifiAPConfig",
                SSID_A_Name: SSID_A_Name,
                SSID_A_Mode: SSID_A_Mode,
                SSID_A_Security: SSID_A_Security,
                SSID_A_Password: SSID_A_Password,
                SSID_A_Stealth: SSID_A_Stealth,
                SSID_A_Privacy: SSID_A_Privacy,
                SSID_A_Max_Client: SSID_A_Max_Client,
                SSID_A_PMF: SSID_A_PMF,             
                SSID_B_Name: SSID_B_Name,
                SSID_B_Mode: SSID_B_Mode,
                SSID_B_Status: SSID_B_Status,
                SSID_B_Security: SSID_B_Security,
                SSID_B_Password: SSID_B_Password,
                SSID_B_Stealth: SSID_B_Stealth,
                SSID_B_Privacy: SSID_B_Privacy,
                SSID_B_Max_Client: SSID_B_Max_Client, 
                SSID_B_PMF: SSID_B_PMF,
                SSID_B_AccessWeb: SSID_B_AccessWeb,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Wifi_Basic_Result == "SUCCESS") {

                    //alert('Success, now setting SetGlobalWifiConfig... ');
                    //location.reload();
                    //============!!!!!!
                    SetGlobalWifiConfigCancelDFSAtBasic(dfs)
                    //SetGlobalWifiConfig();
                } else {
                    alert(obj.Wifi_Basic_Result);
                    return;
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}


function SetGlobalWifiConfigCancelDFSAtBasic(dfs) {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var ApMode, wifi_status, Select_Isolation, Channel24, Bandwidth24, Channel5, Bandwidth5, BandSelection5, TxPower;

    //$.LoadingOverlay("show");
    wifi_status = $("#OLD_Select_wifi_status").val(); //return to previous setting
    Select_Isolation = $("#Select_Isolation").val();

    ApMode = $("#Select_Multi").val();
    Channel24 = $("#Channel24").val();
    Bandwidth24 = $("#Bandwidth24").val();
    Channel5 = $("#Channel5").val();
    Bandwidth5 = $("#Bandwidth5").val();
    BandSelection5 = $("#BandSelection5").val();
    TxPower = $("#TxPower").val();
    
    
    var form = {
        Page: "SetGlobalWifiConfig",
        Status: wifi_status,
        ApMode: ApMode,
        Channel24: Channel24,
        Bandwidth24: Bandwidth24,
        Channel5: Channel5,
        Bandwidth5: Bandwidth5,
        BandSelection5: BandSelection5,
        Isolation: Select_Isolation,
        TxPower: TxPower,
        token: session_token
    };
    //$.LoadingOverlay("show");
    var flag = true;
    if (flag) {

        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetGlobalWifiConfig",
                Status: wifi_status,
                ApMode: ApMode,
                Channel24: Channel24,
                Bandwidth24: Bandwidth24,
                Channel5: Channel5,
                Bandwidth5: Bandwidth5,
                BandSelection5: BandSelection5,
                Isolation: Select_Isolation,
                TxPower: TxPower,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.SetGlobalWifiResult == "SUCCESS") {
                    // alert($.i18n.prop("success.message"));
                    // if (Channel != '56') {
                    //     location.reload();
                    // }

                    if (!dfs) {
                        //alert($.i18n.prop("success.message"));
                        location.reload();
                    } else {
                        // $("#confirmACYes").modal('hide');
                        $.LoadingOverlay("hide");
                        // $("#confirmACNo").modal('show');
                        DFSCountdown();
                    }

                } else {
                    alert(obj.SetGlobalWifiResult);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetDateTime() {
    var Error_Msg = "";
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    //$.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetDateTime",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.GetDateTimeResult == "SUCCESS") {

                if (obj.useAuto == "1") {
                  $('#Select_AutoDateTimeSetting').bootstrapToggle('on');
                } else if (obj.useAuto == "0") {
                  $('#Select_AutoDateTimeSetting').bootstrapToggle('off');
                }

                if (obj.use24Format == "1") {
                    $('#Select_Use24Format').bootstrapToggle('on');
                    } else if (obj.use24Format == "0") {
                    $('#Select_Use24Format').bootstrapToggle('off');
                }

                obj.month = ('0'+ obj.month).slice(-2);
                obj.date = ('0'+ obj.date).slice(-2);
                obj.hour = ('0'+ obj.hour).slice(-2);
                obj.minute = ('0'+ obj.minute).slice(-2);
                $("#year").val(obj.year);
                $("#month").val(obj.month);
                $("#date").val(obj.date);
                $("#hour").val(obj.hour);
                $("#minute").val(obj.minute);
                // $("#second").val(obj.second);
                //$.LoadingOverlay("hide");
            } else {
                alert(obj.GetDateTimeResult);
                return;
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            clearSession();
            //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });

}

function SetDateTime() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var Error_Msg = "";
    var Select_AutoDateTimeSetting, year, month, date, hour, minute, Select_Use24Format;

    year = $("#year").val();
    month = $("#month").val();
    date = $("#date").val();
    hour = $("#hour").val();
    minute = $("#minute").val();
    // second = $("#second").val();    
    

    if ($("#Select_AutoDateTimeSetting").prop('checked')) {
        Select_AutoDateTimeSetting = 1;
    } else {
        Select_AutoDateTimeSetting = 0;
    }

    if ($("#Select_Use24Format").prop('checked')) {
        Select_Use24Format = 1;
    } else {
        Select_Use24Format = 0;
    }

    var data = {
        Page: "SetDateTime",
        year: year,
        month: month,
        date: date,
        hour: hour,
        minute: minute,
        useAuto: Select_AutoDateTimeSetting,
        use24Format: Select_Use24Format,
        token: session_token
    };

    // console.log('post:'+JSON.stringify(data))

    var flag = dateTime_check();
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetDateTime",
                year: year,
                month: month,
                date: date,
                hour: hour,
                minute: minute,
                useAuto: Select_AutoDateTimeSetting,
                use24Format: Select_Use24Format,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                //$.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.Result == "INFO UNAVAILABLE") {
                    //clearSession();
                    alert($.i18n.prop("error.NoReplyfromserver"));
                    return;
                }                   
                if (obj.SetDateTimeResult == "SUCCESS") {

                    alert($.i18n.prop("success.message"));
                    clearSession();
                    //location.reload();
                    //SetDataUsageReset();

                } else {
                    alert(obj.SetDateTimeResult);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function dateTime_check() {

    if (!ValidateDateTimeInputValue("year", 2021, 2037)) {
        return false;
    } else if (!ValidateDateTimeInputValue("month", 1, 12)) {
        return false;
    } else if (!ValidateDateTimeInputValue("date", 1, 31)) {
        return false;
    } else if (!ValidateDateTimeInputValue("hour", 0, 23)) {
        return false;
    } else if (!ValidateDateTimeInputValue("minute", 0, 59)) {
        return false;
    } else {
        return true;
    }

}

function ValidateDateTimeInputValue(id, min, max) {
    var item = $("#" + id).val();
    var VALID;

    if (item != parseInt(item, 10) || item == "" || (item.toString().indexOf('.') != -1)) {  
        VALID = 0;
        alert($.i18n.prop("err.SetTmeDesc"))
        //alert("The input value is not a Number.");
        $("#" + id).focus();
    } else {
        if (item < min) {
            VALID = 0;
            alert($.i18n.prop("err.SetTmeDesc"))
            //alert("The input value must greater than " + min);
            $("#" + id).focus();
        } else if (item > max) {
            VALID = 0;
            alert($.i18n.prop("err.SetTmeDesc"))
            //alert("The input value must less than " + max);
            $("#" + id).focus();
        } else {
            VALID = 1;
        }
    }
    return VALID;
}

function openConfirmSetTimeModal() {
    var flag = dateTime_check();
    if (flag) {
        $("#confirmSetTime").modal('show');
    } 
}

function GetLocationHistory() {
    var Error_Msg = "";
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetLocationHistory",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.GetLocationHistoryResult == "SUCCESS") {

                //var locationHistory = {"Page":"GetLocationHistory","list":[{"date":"2021/03/17 11:22:33","status":"NG (0002)","latitude":"34.450851","longitude": "132.709283","accuracy":"20"},{"date":"2021/03/18 11:22:33","status":"NG (0002)","latitude":"34.450851","longitude": "132.709283","accuracy":"20"}]};
                var locationHistoryContent = "";
                if(obj.list.length>0) {
                    for (i = 0; i < obj.list[0].list.length; i++) {
                        locationHistoryContent += 
                        '<tr>'+
                        '<th scope="row">'+obj.list[0].list[i].date+'</th>'+
                        '<td>'+obj.list[0].list[i].status+'</td>'+
                        '<td>'+obj.list[0].list[i].latitude+'</td>'+
                        '<td>'+obj.list[0].list[i].longitude+'</td>'+
                        '<td>'+obj.list[0].list[i].accuracy+'</td>'+
                        '</tr>';
                    }
                }
                $("#locationHistoryContent").html(locationHistoryContent);

            } else {
                alert(obj.GetLocationHistoryResult);
                return;
            }
        }
    })
}

function cancelSelectFile() {
    $("#confirmStartToUpload").modal('hide');
    $("#upload_name").text('');    
    $("#upload_file").replaceWith($("#upload_file").val('').clone(true));
}

function GetWPSStatus() {
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetWPSStatus",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            var obj = jQuery.parseJSON(msgs);
            if (obj.result == "AUTH_FAIL") {
                //clearSession();
                clearSession();
                alert($.i18n.prop("error.AUTH_FAIL"));
                return;
            }
            if (obj.result == "Token_mismatch") {
                clearSession();
                alert($.i18n.prop("error.Token_mismatch"));
                return;
            }
            if (obj.commit == "Socket Send Error") {
                clearSession();
                alert($.i18n.prop("error.SocketSendError"));
                return;
            }
            if (obj.result == "QTApp_Login") {
                clearSession();
                alert($.i18n.prop("common.Routerdeviceinuse"));
                return;
            }
            if (obj.GetWPSStatusResult == "SUCCESS") {

                switch (String(obj.Status)) {
                    case "1":
                        $("#wps_start").hide();
                        $("#wps_stop").show();
                        $("#status").html('<span data-locale="body.WPSStatusProcess">'+ $.i18n.prop("body.WPSStatusProcess") +'</span>');

                        break;
                    case "0":
                        $("#wps_start").show();
                        $("#wps_stop").hide();
                        $("#status").html('<span data-locale="body.WPSStatusIDLE">'+ $.i18n.prop("body.WPSStatusIDLE") +'</span>');
                    break;
                }

            } else {
                alert(obj.GetWPSStatusResult);
                return;
            }
        }
    })    
}

function addLANIPCheck() {
    var totalCount = $("#totalCount").val();
    if(totalCount>=50) {
        alert($.i18n.prop("error.addportmappingmore50"));
    }else {
        $("#addLANIP").modal("show");
    }
}

function SetBasicWifiAPConfigCancelDFSAtAdvance() {
    var checkLogin = checkSession();
    if (checkLogin == "off") {
        backToHome();
        return false;
    }
    var dfs = $("#DFS").val();
    var Error_Msg = "";
    var wifi_status, ApMode, Channel24, Bandwidth24, Channel5, Bandwidth5, BandSelection5, TxPower, Isolation, BandSelection5;

    //$.LoadingOverlay("show");
    wifi_status = $("#wifi_status").val();
    ApMode = $("#ApMode").val();
    
    Channel24 = $("#OLD_Channel24").val();
    Bandwidth24 = $("#OLD_Bandwidth24").val();
    Channel5 = $("#OLD_Channel5").val();
    Bandwidth5 = $("#OLD_Bandwidth5").val();
    TxPower = $("#OLD_TxPower").val();
    BandSelection5 = $("#OLD_Bandselection5").val();

    Isolation = $("#Isolation").val();

    var form = {
        Page: "SetGlobalWifiConfig",
        Status: wifi_status,
        ApMode: ApMode,
        Channel24: Channel24,
        Bandwidth24: Bandwidth24,
        Channel5: Channel5,
        Bandwidth5: Bandwidth5,
        BandSelection5: BandSelection5,
        Isolation: Isolation,
        TxPower: TxPower,
        token: session_token
    };
    console.log(JSON.stringify(form))    
    var flag = SetGlobalWifiConfigAtAdvanced_check();
    // flag = false;
    if (flag) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "POST",
            url: "../../cgi-bin/qcmap_web_cgi",
            data: {
                Page: "SetGlobalWifiConfig",
                Status: wifi_status,
                ApMode: ApMode,
                Channel24: Channel24,
                Bandwidth24: Bandwidth24,
                Channel5: Channel5,
                Bandwidth5: Bandwidth5,
                Bandselection5: BandSelection5,
                Isolation: Isolation,
                TxPower: TxPower,
                token: session_token
            },
            dataType: "text",
            success: function (msgs) {
                $.LoadingOverlay("hide");
                var obj = jQuery.parseJSON(msgs);
                if (obj.result == "AUTH_FAIL") {
                    //clearSession();
                    clearSession();
                    alert($.i18n.prop("error.AUTH_FAIL"));
                    return;
                }
                if (obj.result == "Token_mismatch") {
                    clearSession();
                    alert($.i18n.prop("error.Token_mismatch"));
                    return;
                }
                if (obj.commit == "Socket Send Error") {
                    clearSession();
                    alert($.i18n.prop("error.SocketSendError"));
                    return;
                }
                if (obj.result == "QTApp_Login") {
                    clearSession();
                    alert($.i18n.prop("common.Routerdeviceinuse"));
                    return;
                }
                if (obj.SetGlobalWifiResult == "INTERNAL ERROR") {
                    alert($.i18n.prop("common.dfsNotAvailable"));
                    return;
                }  
                else if (obj.SetGlobalWifiResult == "SUCCESS") {
                        //alert($.i18n.prop("success.message"));
                        location.reload();
                } else {
                    alert(obj.SetGlobalWifiResult);
                    return;
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.LoadingOverlay("hide");
                //clearSession();
                //alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function GetAnyWhereInfo(callFunc1, callFunc2, callFunc3) {
    //getBatteryIcon(20);
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    if (!callFunc3) callFunc3 = null;
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetAnyWhereInfo",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                var _obj = obj


                if(_obj.NowDateTime) {
                    if( _obj.use24Format && String(_obj.use24Format)=="1") { //24 format
                        var NowDateTime = _obj.NowDateTime.substring(0, _obj.NowDateTime.length - 3);
                        $("#NowDateTime").html(NowDateTime);
                    }else { //12 format
                        var NowDateTime = _obj.NowDateTime;
                        var temp = NowDateTime.split(" ");
                        var temp2 = temp[1].split(":");
                        var hour = temp2[0];
                        var hourMinute = temp[1].substring(0, temp[1].length - 3);
                        var dateTimeString = '';
                        if(hour<=12) {
                            dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jam">'+$.i18n.prop("datetimeHour.jam")+'</span>'+hourMinute+'<span data-locale="datetimeHour.am">'+$.i18n.prop("datetimeHour.am")+'</span>';
                        }else {
                            hour = ('0'+(parseInt(hour)-12)).slice(-2);
                            hourMinute = hour + ':' + temp2[1];
                            dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jpm">'+$.i18n.prop("datetimeHour.jpm")+'</span>'+hourMinute+'<span data-locale="datetimeHour.pm">'+$.i18n.prop("datetimeHour.pm")+'</span>';
                        }
                        $("#NowDateTime").html(dateTimeString);
                    }
                }
                switch(String(_obj.NewUpdateNotice)) {
                    case "1":
                        $(".notification_icon").show();
                    break;
                    case "2":
                        $(".downloading_icon").show();
                    break;  
                    default:
                    break;
                }

                if (callFunc1) {
                    if (callFunc2) {
                        if (callFunc3) {
                            callFunc1(callFunc2, callFunc3);
                        } else {
                            callFunc1(callFunc2);
                        }
                    } else {
                        callFunc1();
                    }
                }

                return;
                //}
            } 
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function getDeviceInfo2(callFunc1, callFunc2, callFunc3) {
    //getBatteryIcon(20);
    if (!callFunc1) callFunc1 = null;
    if (!callFunc2) callFunc2 = null;
    if (!callFunc3) callFunc3 = null;
    $.ajax({
        type: "POST",
        url: "../../cgi-bin/qcmap_web_cgi",
        data: {
            Page: "GetHomeDeviceInfo2",
            mask: "0",
            token: session_token
        },
        dataType: "text",
        success: function (msgs) {
            if (msgs.length > 0) {
                var obj = jQuery.parseJSON(msgs);
                var _obj = obj

                getSignalIcon(_obj.HomeResult, _obj.SignalStatus, _obj.SignalStrength);
                getConnectIcon(_obj.SignalStatus, _obj.ConnectStatus);
                // getBatteryIcon(_obj.BatteryStatus, _obj.BatteryCapacity);


                if (_obj.EthernetStatus == 1) {
                    $(".ethernet_icon").show()
                }
                switch(String(_obj.NewUpdateNotice)) {
                    case "1":
                        $(".notification_icon").show();
                    break;
                    case "2":
                        $(".downloading_icon").show();
                    break;  
                    default:
                    break;
                }


                // if(_obj.NowDateTime) {
                //     if( _obj.use24Format && String(_obj.use24Format)=="1") { //24 format
                //         var NowDateTime = _obj.NowDateTime.substring(0, _obj.NowDateTime.length - 3);
                //         $("#NowDateTime").html(NowDateTime);
                //     }else { //12 format
                //         var NowDateTime = _obj.NowDateTime;
                //         var temp = NowDateTime.split(" ");
                //         var temp2 = temp[1].split(":");
                //         var hour = temp2[0];
                //         var hourMinute = temp[1].substring(0, temp[1].length - 3);
                //         var dateTimeString = '';
                //         if(hour<=12) {
                //             dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jam">'+$.i18n.prop("datetimeHour.jam")+'</span>'+hourMinute+'<span data-locale="datetimeHour.am">'+$.i18n.prop("datetimeHour.am")+'</span>';
                //         }else {
                //             hour = ('0'+(parseInt(hour)-12)).slice(-2);
                //             hourMinute = hour + ':' + temp2[1];
                //             dateTimeString = temp[0]+' '+'<span data-locale="datetimeHour.jpm">'+$.i18n.prop("datetimeHour.jpm")+'</span>'+hourMinute+'<span data-locale="datetimeHour.pm">'+$.i18n.prop("datetimeHour.pm")+'</span>';
                //         }
                //         $("#NowDateTime").html(dateTimeString);
                //     }
                // }

                localStorage.setItem('NetworkName', _obj.NetworkName);
                localStorage.setItem('SignalStatus', _obj.SignalStatus);
                localStorage.setItem('MCC', _obj.MCC);

                setTimeout(function (){
                  // Something you want delayed.
                    $(".form-control:not(.show-password)").show();
                    $(".custom-switch").show();
                    $(".custom-checkbox").show();
                }, 200); // How long do you want the delay to be (in milliseconds)? 

                if (callFunc1) {
                    if (callFunc2) {
                        if (callFunc3) {
                            callFunc1(callFunc2, callFunc3);
                        } else {
                            callFunc1(callFunc2);
                        }
                    } else {
                        callFunc1();
                    }
                }

                return;
                //}
            } 
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}