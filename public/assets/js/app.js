"use strict";

function parseJWT (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

function logout(baseUrl, _cb) {
    localStorage.removeItem(baseUrl+'_tokenize');
    if(_cb && typeof _cb === "function") {
        _cb();
    } else {
        return location = baseUrl + '/login';
    }
}

function getToken(baseUrl, _cb) {
    if(getWithExpiry(baseUrl+'_tokenize') === null) {
        profile_nav.data.token = null;
        profile_nav.data.baseUrl = '';
        if(_cb && typeof _cb === "function") {
            _cb(null);
        } else {
            return null;
        }
    } else {
        var token = getWithExpiry(baseUrl+'_tokenize');
        if(token) {
            profile_nav.data.token = token;
            profile_nav.data.baseUrl = baseUrl;
        }
        if(_cb && typeof _cb === "function") {
            _cb(token);
        } else {
            return token;
        }
    }
}

var profile_nav = new Reef('#profile_nav', {
    data: {
        token: null,
        baseUrl: ''
    },
    template: function (props) {
        if(props.token) {
            var profile = parseJWT(props.token);
            return `<div class="navbar-item has-dropdown has-dropdown-with-icons has-divider has-user-avatar is-hoverable">
            <a class="navbar-link is-arrowless">
              <div class="is-user-avatar">
                <img src="https://gravatar.com/avatar/${MD5(profile.mail)}" alt="${profile.unm}">
              </div>
              <div class="is-user-name"><span>${profile.unm}</span></div>
              <span class="icon"><i class="mdi mdi-chevron-down"></i></span>
            </a>
            <div class="navbar-dropdown">
              <a href="${props.baseUrl+'/user/'+profile.unm}" class="navbar-item">
                <span class="icon"><i class="mdi mdi-account"></i></span>
                <span>My Profile</span>
              </a>
              <a class="navbar-item">
                <span class="icon"><i class="mdi mdi-cog"></i></span>
                <span>Settings</span>
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item" onclick="logout('${props.baseUrl}')">
                <span class="icon"><i class="mdi mdi-logout"></i></span>
                <span>Log Out</span>
              </a>
            </div>
          </div>`;
        } else {
            return '';
        }
    }
});
profile_nav.render();