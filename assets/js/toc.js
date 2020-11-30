import $ from "jquery";
import ClipboardJS from "clipboard";

function createIcon(iconId) {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '{{ .Site.BaseURL }}icons.svg#' + iconId);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList = "icon";
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.appendChild(use);
    return svg;
}

window.addEventListener('DOMContentLoaded', () => {
    // Get ToC div
    toc = document.getElementById("ToC");//Add a header
    if (toc) {
        /*
            Handles the table of content active items
        */
        const motionQuery = window.matchMedia('(prefers-reduced-motion)');
        // Create a list for the ToC entries 
        tocList = document.createElement("ul");

        tocNav = document.createElement("nav");
        tocNav.id ="TableOfContents";
        
        headers = document.getElementsByTagName("h3");
        // For each h3
        for (i = 0; i < headers.length; i++){
            name = headers[i].id;
            // create an anchor
            const anchorIcon = createIcon('link');
            anchor = document.createElement("a");
            anchor.setAttribute("href","#"+name);
            anchor.classList.add('anchor');
            anchor.appendChild(anchorIcon);
            headers[i].appendChild(anchor);

        }

        headers = document.getElementsByTagName("h2");
        // For each h2
        for (i = 0; i < headers.length; i++){
            name = headers[i].id;
            // create an anchor
            const anchorIcon = createIcon('link');
            anchor = document.createElement("a");
            anchor.setAttribute("href","#"+name);
            anchor.classList.add('anchor');
            anchor.appendChild(anchorIcon);
            headers[i].appendChild(anchor);

            // a list item for the entry
            tocListItem = document.createElement("li");
            
            // a link for the h3
            tocEntry = document.createElement("a");
            tocEntry.setAttribute("href","#"+name);
            tocEntry.innerText=headers[i].innerText;
            tocListItem.appendChild(tocEntry);
            tocList.appendChild(tocListItem);
        }
        tocNav.appendChild(tocList);
        toc.appendChild(tocNav); 

        const TableOfContents = {
            container: document.querySelector('#TableOfContents'),
            links: null,
            headings: null,
            intersectionOptions: {
                rootMargin: '0px',
                threshold: 1
        },

        previousSection: null,
        observer: null,

        init() {
            this.handleObserver = this.handleObserver.bind(this);

            this.setUpObserver();
            this.findLinksAndHeadings();
            this.observeSections();


            this.links.forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
            });
        },


        handleLinkClick(evt) {
            evt.preventDefault();
            let target = evt.target.getAttribute('href');
            let id = target.replace('#', '');

            let section = this.headings.find(heading => {
              return heading.getAttribute('id') === id;
            });

            section.setAttribute('tabindex', -1);
            section.focus();

            window.location.hash = target;
            window.scroll({
                behavior: motionQuery.matches ? 'instant' : 'smooth',
                top: section.offsetTop + 200,
                block: 'start'
            });

            if (this.container.classList.contains('active')) {
             this.container.classList.remove('active');
            }
        },

        handleObserver(entries, observer) {
            entries.forEach(entry => {
            let href = `#${entry.target.getAttribute('id')}`,
                link = this.links.find(l => l.getAttribute('href') === href);


            if (entry.isIntersecting && entry.intersectionRatio >= 1) {
                link.classList.add('is-visible');
                this.previousSection = entry.target.getAttribute('id');
            } else {
                link.classList.remove('is-visible');
            }

            this.highlightFirstActive();
            });
        },

        highlightFirstActive() {
            let firstVisibleLink = this.container.querySelector('.is-visible');

            this.links.forEach(link => {
            link.classList.remove('active');
            });

            if (firstVisibleLink) {
            firstVisibleLink.classList.add('active');
            }

            if (!firstVisibleLink && this.previousSection) {
            this.container.querySelector(
                `a[href="#${this.previousSection}"]`).
                classList.add('active');
            }
        },

        observeSections() {
            this.headings.forEach(heading => {
            this.observer.observe(heading);
            });
        },

        setUpObserver() {
            this.observer = new IntersectionObserver(
            this.handleObserver,
            this.intersectionOptions);

        },

        findLinksAndHeadings() {
            this.links = [...this.container.querySelectorAll('a')];
            this.headings = this.links.map(link => {
            let id = link.getAttribute('href');
            return document.querySelector(id);
            });
        }
        };
        TableOfContents.init();
    }
    /*
        Ends table of content active items
    */

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #main__content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });


    const scrollElement = $("#sidebar li.active")[0];
    if (scrollElement) scrollElement.scrollIntoView(false);

    const $codes = document.querySelectorAll('pre');

    function addCopy(element) {
        const icon = createIcon('clone');
        const copy = document.createElement("button");
        copy.className = "copy btn btn-outline-light float-right";
        copy.appendChild(icon);
        copy.appendChild(document.createTextNode(" Copy"));
        element.append(copy);
    }

    for (var i = 0, len = $codes.length; i < len; i++) {
        addCopy($codes[i]);
    }

    new ClipboardJS('.copy', {
        target: function (trigger) {
        return trigger.previousElementSibling;
        }
    });
    
    $('[data-toggle="tooltip"]').tooltip();

    $.fn.mailgun_validator = function(options) {
        return this.each(function() {
            var thisElement = $(this);
            thisElement.focusout(function(e) {
                //Trim string and autocorrect whitespace issues
                var elementValue = thisElement.val();
                elementValue = $.trim(elementValue);
                thisElement.val(elementValue);

                //Attach event to options
                options.e = e;

                run_validator(elementValue, options, thisElement);
            });
        });
    };

    function run_validator(address_text, options, element) {
        //Abort existing AJAX Request to prevent flooding
        if(element.mailgunRequest) {
            element.mailgunRequest.abort();
            element.mailgunRequest = null;
        }

        // don't run validator without input
        if (!address_text) {
            return;
        }

        // validator is in progress
        if (options && options.in_progress) {
            options.in_progress(options.e);
        }

        // don't run dupicate calls
        if (element.mailgunLastSuccessReturn) {
            if (address_text == element.mailgunLastSuccessReturn.address) {
                if (options && options.success) {
                    options.success(element.mailgunLastSuccessReturn, options.e);
                }
                return;
            }
        }

        // length and @ syntax check
        var error_message = false;
        if (address_text.length > 512)
            error_message = 'Email address exceeds maxiumum allowable length of 512.';
        else if (1 !== address_text.split('@').length-1)
            error_message = 'Email address must contain only one @.';

        if (error_message) {
            if (options && options.error) {
                options.error(error_message, options.e);
            }
            else {
                if (console) console.log(error_message);
            }
            return;
        }

        // require api key
        if (options && options.api_key == undefined) {
            if (console) console.log('Please pass in api_key to mailgun_validator.');
        }

        // timeout incase of some kind of internal server error
        var timeoutID = setTimeout(function() {
            error_message = 'Error occurred, unable to validate address.';
            if (!success) {
                //Abort existing AJAX Request for a true timeout
                if(element.mailgunRequest) {
                    element.mailgunRequest.abort();
                    element.mailgunRequest = null;
                }

                if (options && options.error) {
                    options.error(error_message, options.e);
                }
                else {
                    if (console) console.log(error_message);
                }
            }
        }, 30000); //30 seconds

        // make ajax call to get validation results
        element.mailgunRequest = $.ajax({
            type: "GET",
            url: 'https://api.mailgun.net/v3/address/validate?callback=?',
            data: { address: address_text, api_key: options.api_key },
            dataType: "jsonp",
            crossDomain: true,
            success: function(data, status_text) {
                clearTimeout(timeoutID);

                element.mailgunLastSuccessReturn = data;
                if (options && options.success) {
                    options.success(data, options.e);
                }
            },
            error: function(request, status_text, error) {
                clearTimeout(timeoutID);
                error_message = 'Error occurred, unable to validate address.';

                if (options && options.error) {
                    options.error(error_message, options.e);
                }
                else {
                    if (console) console.log(error_message);
                }
            }
        });
    }

  //Newsletter
  $('#newsletter-field').on('keypress', function (e) {
    $('#newsletter-cta').removeAttr('disabled')
    if (e.keycode == 13) {
      $('#newsletter-field').trigger('focusout');
      return false;
    }
  });
  $("#newsletter-cta").on('hover', function () {
    $('#newsletter-field').trigger('focusout');
    return false;
  });
  // capture clicks on validate and do nothing
  $(".newsletter-form form").on('submit', function (e) {
    e.preventDefault();
    const url_location = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    $.ajax({
      url: url_location + "/subscribe/",
      dataType: 'json',
      method: 'GET',
      data: {
        EMAIL: $("input[name='EMAIL']").val(),
        SOURCE: $("input[name='SOURCE']").val()
      }
    }).done(function (result) {
      console.log("Ajax method newsletter result: " + result);
      trackNewsletter(
        'newsletter',
        'newsletter_signup',
        'fromHomepage'
      );
    }).fail(function (jqxhr, textStatus, error) {
      console.log(jqxhr);
    }).always(function () {
      $("input[name='EMAIL']").val('');
      $("input[name='EMAIL']").closest('.newsletter-form').append('<p class="sub-success">Subscription Succeeded! ✅</p>');
      $('#newsletter-status').remove();
    });
  });
  // attach jquery plugin to validate address
  $('#newsletter-field').mailgun_validator({
    api_key: 'pubkey-fb03d9341661be1fc385555596902c97',
    in_progress: validation_in_progress,
    success: validation_success,
    error: validation_error,
  });

  // while the lookup is performing
  function validation_in_progress() {
    $('#newsletter-status').html("<img src='{{ .Site.BaseURL }}images/ajax-loader.gif' height='16'/>");
    $('#newsletter-cta').css('cursor', 'progress').attr("disabled", true);
  }
  // if email successfull validated
  function validation_success(data_status) {
    $('#newsletter-status').html(get_suggestion_str(data_status['is_valid'], data_status['did_you_mean']));
    $('#newsletter-cta').removeAttr('disabled').css('cursor', 'pointer');
  }
  // if email is invalid
  function validation_error(error_message) {
    $('#newsletter-status').html(error_message);
    $('#newsletter-cta').css('cursor', 'not-allowed');
  }
  // suggest a valid email
  function get_suggestion_str(is_valid, alternate) {
    if (is_valid) {
      var result = '<span class="success">Address seems valid 👍 Go!</span>';
      if (alternate) {
        result += '<br/><span class="warning"> (Though did you mean <em>' + alternate + '</em>? 😎)</span>';
      }
      return result
    } else if (alternate) {
      return '<span class="warning">Did you mean <em>' + alternate + '</em>? 🤔</span>';
    } else {
      $("input[name='EMAIL']").val('');
      return '<span class="error">Address is invalid. 😿</span>';
    }
  }
  //End Newsletter
});