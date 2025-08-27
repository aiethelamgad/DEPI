document.addEventListener('DOMContentLoaded', function () {
            const dropdownItems = document.querySelectorAll('.navbar-nav .nav-item.dropdown');

            dropdownItems.forEach(function (dropdown) {
                dropdown.addEventListener('mouseenter', function () {
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (toggle && menu) {
                        toggle.classList.add('show');
                        menu.classList.add('show');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                });

                dropdown.addEventListener('mouseleave', function () {
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (toggle && menu) {
                        toggle.classList.remove('show');
                        menu.classList.remove('show');
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });
            // Initialize Swiper slider
            var swiper = new Swiper('.swiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    650: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    },
                },
            });

        });

        // Simple dropdown for theme switcher (no Bootstrap JS required)
        document.addEventListener('DOMContentLoaded', function () {
            var btn = document.querySelector('.theme-switcher');
            var menu = btn && btn.nextElementSibling;
            if (!btn || !menu) return;
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                menu.classList.toggle('show');
                menu.style.display = menu.classList.contains('show') ? 'block' : '';
                // Positioning for center
                menu.style.left = '50%';
                menu.style.transform = 'translateX(-50%)';
            });
            // Hide dropdown when clicking outside
            document.addEventListener('click', function (e) {
                if (!menu.contains(e.target) && e.target !== btn) {
                    menu.classList.remove('show');
                    menu.style.display = '';
                }
            });

            // Theme switching logic
            var themeButtons = menu.querySelectorAll('[data-bs-theme-value]');
            var html = document.documentElement;
            var autoListener = null;
            function setTheme(value) {
                if (autoListener) {
                    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', autoListener);
                    autoListener = null;
                }
                if (value === 'auto') {
                    var applySystemTheme = function () {
                        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        html.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
                    };
                    applySystemTheme();
                    autoListener = function () { applySystemTheme(); };
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', autoListener);
                } else {
                    html.setAttribute('data-bs-theme', value);
                }
            }
            themeButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var value = button.getAttribute('data-bs-theme-value');
                    setTheme(value);
                    // Update active state
                    themeButtons.forEach(function (btn) {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    });
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
                    // Optionally close the dropdown
                    menu.classList.remove('show');
                    menu.style.display = '';
                });
            });
        });

        // Dropdowns on hover/click and responsive navbar
        document.addEventListener('DOMContentLoaded', function() {
          // Dropdowns
          var dropdownToggles = document.querySelectorAll('.nav-item.dropdown, .dropend, .dropstart, .dropup');
          dropdownToggles.forEach(function(item) {
            var toggle = item.querySelector('.dropdown-toggle');
          var customizerBtn = document.getElementById('customize-btn');
            if (!toggle || !menu) return;
            // Desktop: open on hover
            item.addEventListener('mouseenter', function() {
              if (window.innerWidth >= 992) {
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
              }
            });
            item.addEventListener('mouseleave', function() {
              if (window.innerWidth >= 992) {
                menu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                // Hide any open submenus
                var submenus = item.querySelectorAll('.dropdown-menu .dropdown-menu');
                submenus.forEach(function(sub) { sub.classList.remove('show'); });
              }
            });
            // Always open on click (mobile and desktop)
            toggle.addEventListener('click', function(e) {
              e.preventDefault();
              var isOpen = menu.classList.contains('show');
              // Close all other open dropdowns
              document.querySelectorAll('.dropdown-menu.show').forEach(function(openMenu) {
                if (openMenu !== menu) openMenu.classList.remove('show');
              });
              menu.classList.toggle('show', !isOpen);
              toggle.setAttribute('aria-expanded', String(!isOpen));
            });
            // Submenu logic: open submenu on hover (desktop)
            var subToggles = menu.querySelectorAll('.dropdown-toggle');
            subToggles.forEach(function(subToggle) {
              var subMenu = subToggle.nextElementSibling;
              if (subMenu && subMenu.classList.contains('dropdown-menu')) {
                subToggle.addEventListener('mouseenter', function() {
                  if (window.innerWidth >= 992) {
                    subMenu.classList.add('show');
                  }
                });
                subToggle.addEventListener('mouseleave', function() {
                  if (window.innerWidth >= 992) {
                    subMenu.classList.remove('show');
                  }
                });
              }
            });
          });
          // Close dropdowns when clicking outside
          document.addEventListener('click', function(e) {
            document.querySelectorAll('.dropdown-menu.show').forEach(function(menu) {
              if (!menu.contains(e.target) && !menu.parentElement.contains(e.target)) {
                menu.classList.remove('show');
                var toggle = menu.parentElement.querySelector('.dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
              }
            });
          });

          // Responsive navbar offcanvas
          var navbarToggler = document.querySelector('.navbar-toggler');
          var navbarNav = document.getElementById('navbarNav');
          if (navbarToggler && navbarNav) {
            navbarToggler.addEventListener('click', function(e) {
              e.preventDefault();
              navbarNav.classList.toggle('show');
              if (navbarNav.classList.contains('show')) {
                navbarNav.style.visibility = 'visible';
                navbarNav.style.transform = 'none';
              } else {
                navbarNav.style.visibility = '';
                navbarNav.style.transform = '';
              }
            });
            // Close offcanvas when clicking close button or outside
            var closeBtn = navbarNav.querySelector('.btn-close');
            if (closeBtn) {
              closeBtn.addEventListener('click', function() {
                navbarNav.classList.remove('show');
                navbarNav.style.visibility = '';
                navbarNav.style.transform = '';
              });
            }
            document.addEventListener('click', function(e) {
              if (window.innerWidth < 992 && navbarNav.classList.contains('show')) {
                if (!navbarNav.contains(e.target) && e.target !== navbarToggler) {
                  navbarNav.classList.remove('show');
                  navbarNav.style.visibility = '';
                  navbarNav.style.transform = '';
                }
              }
            });
          }
        });


document.addEventListener('DOMContentLoaded', function () {
  // Existing code unchanged...

  // Add customizer toggle without Bootstrap
  var customizeBtn = document.getElementById('customize-btn');
  var customizer = document.getElementById('customizer');
  var customizerCloseBtn = customizer ? customizer.querySelector('.btn-close') : null;

  if (customizeBtn && customizer) {
    customizeBtn.addEventListener('click', function () {
      if (customizer.style.display === 'block') {
        customizer.style.display = 'none';
      } else {
        customizer.style.display = 'block';
      }
    });
  }

  if (customizerCloseBtn && customizer) {
    customizerCloseBtn.addEventListener('click', function () {
      customizer.style.display = 'none';
    });
  }
});
