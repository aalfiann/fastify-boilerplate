"use strict";

var menu_aside = new Reef('#menu_aside', {
    data: {
        baseUrl: '',
        menu: []
    },
    template: function (props) {
        if(props.menu.length > 0) {
            return `<p class="menu-label">Client Area</p>
            <ul class="menu-list">
                ${props.menu.map(function(menus){
                    if(menus.type === 'link') {
                        return `<li>
                            <a href="${(menus.url.indexOf('://') !== -1 ? menus.url: props.baseUrl + menus.url)}" class="is-active router-link-active has-icon">
                            <span class="icon"><i class="${menus.icon}"></i></span>
                            <span class="menu-item-label">${menus.name}</span>
                            </a>
                        </li>`;
                    } else {
                        return `<li>
                        <a class="has-icon has-dropdown-icon">
                          <span class="icon"><i class="mdi mdi-view-list"></i></span>
                          <span class="menu-item-label">${menus.name}</span>
                          <div class="dropdown-icon">
                            <span class="icon"><i class="mdi mdi-plus"></i></span>
                          </div>
                        </a>
                        <ul>
                          ${menus.child.map(function(child) {
                            return `<li>
                                <a href="${(child.url.indexOf('://') !== -1 ? child.url : props.baseUrl + child.url)}">
                                <span class="ml-4"><i class="mdi mdi-arrow-right mr-2"></i>${child.name}</span>
                                </a>
                            </li>`;
                          }).join('')}
                        </ul>
                      </li>`;
                    }
                    
                }).join('')}
            </ul>`;
        } else {
            return '';
        }
    }
});
menu_aside.render();

document.addEventListener('render', function (event) {
	// Only run for elements with the #menu_aside ID
	if (!event.target.matches('#menu_aside')) return;
	// Log the data at the time of render
	if (event.detail.menu.length > 0); {
        /* Aside: submenus toggle */
        Array.from(document.getElementsByClassName('menu is-menu-main internal')).forEach(function (el) {
            Array.from(el.getElementsByClassName('has-dropdown-icon')).forEach(function (elA) {
                elA.addEventListener('click', function (e) {
                    var dropdownIcon = e.currentTarget.getElementsByClassName('dropdown-icon')[0].getElementsByClassName('mdi')[0];
                    e.currentTarget.parentNode.classList.toggle('is-active');
                    dropdownIcon.classList.toggle('mdi-plus');
                    dropdownIcon.classList.toggle('mdi-minus');
                });
            });
        });
    }
}, false);

function getMenu(baseUrl, token, _cb) {
    if(token) {
        ajax({
            headers: {
              'x-token': token
            }
        })
        .get(baseUrl + '/api/menu/parent/list-by-role')
        .then(function(response, xhr) {
            menu_aside.data.baseUrl = baseUrl;
            menu_aside.data.menu = response.data;
            var validMenu = false;
            for(var i=0; i < response.data.length; i++) {
                if(response.data[i].type === 'link') {
                    if(location.href == baseUrl+response.data[i].url) {
                        validMenu = true;
                        break;
                    }
                } else {
                    for(var x=0; x< response.data[i].child.length; x++) {
                        if(location.href == baseUrl+response.data[i].child[x].url) {
                            validMenu = true;
                            break;
                        }
                    }
                }
            }
            if(_cb && typeof _cb === "function") {
                _cb(validMenu);
            } else {
                return validMenu;
            }
        })
        .catch(function(response, xhr) {
            console.log(xhr.responseText);
        })
    }
}