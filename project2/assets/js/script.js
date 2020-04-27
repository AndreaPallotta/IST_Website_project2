// go back to top on reload
$(window).on('load', function () {
    $("body, html").animate({
        scrollTop: 0
    }, 'slow');
});

// function to get JSON data from ther API via AJAX
function xhr(getPost, d, idForSpinner) {
    return $.ajax({
        type: getPost,
        dataType: 'json',
        data: d,
        cache: false,
        async: true,
        url: 'proxy.php',
        beforeSend: function () {
            $(idForSpinner).append('<img src="assets/media/spin.gif" class="spin"/>');
        }
    }).always(function () {
        $(idForSpinner).find('.spin').fadeOut(500, function () {
            $(this).remove();
        });
    }).fail(function (err) {
        console.log('there was an AJAX error');
        console.log(err);
    })
}

// function that gets attribute name
function getAttributesByName(arr, name, val) {
    var result = null;
    $.each(arr, function () {
        if (this[name] === val) {
            result = this;
        }
    });

    return this;
}

// when document is ready
$(document).ready(function () {

    /** 
     * function to load images on scroll. 
     */
    lazyload();

    // function that changes what is showed on the page according to the active tab (faculty/staff)
    $('#people li').click(function () {
        $('#people li').removeClass('is-active');
        $(this).addClass('is-active');
        $('#tab-content div').removeClass('is-active');
        $('div[data-content="' + $(this).data('tab') + '"]').addClass('is-active');
    });

    // get height of navbar
    $('#progress_site').css({
        top: $('.navbar').innerHeight()
    });


    // change class on click (navbar) to show what section the user is on
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    // increase or decrease the value of the progress bar according to the scroll
    $(window).scroll(function () {
        let s = $(this).scrollTop();
        let d = $(document).height() - $(window).height();
        let scrollPercentage = (s / d) * 100;
        $('#progress_site').attr('value', scrollPercentage);
    });

    /**
     * about
     */
    xhr('get', {
        path: '/about/'
    }, '#about').done(function (json) {
        $('#about_title').append('<h2>' + json.title + '</h2>');
        $('#about_description').append('<h2>' + json.description + '</h2>');
        $('#about_quote').append('<h2> &quot;' + json.quote + ' &quot;</h2>');
        $('#about_quoteAuthor').append('<h2>~ ' + json.quoteAuthor + '</h2>');

    });

    /**
     * Udergraduate
     */
    xhr('get', {
        path: '/degrees/undergraduate/'
    }, '#degrees-undergrad').done(function (json) {
        $.each(json.undergraduate, function (i, item) {
            // create cards that can be clicked to open modal
            $('#degrees-undergrad').append('<div class="degrees-undergrad-name card modal_open_staff modal-button"><h5 style = "color: #009CBD;"> ' + this.title + ' </h5></div>');
            $('.degrees-undergrad-name').eq(i).append('<p class="degrees-undergrad-description">' + this.description + '</p>');

            // populate modals
            if (this.degreeName == 'cit') {
                $('#cit_title').append(this.title);
                $.each(this.concentrations, function () {
                    $('#cit_body').append('<p>' + this + '</p>');
                });
            } else if (this.degreeName == 'wmc') {
                $('#wmc_title').append(this.title);
                $.each(this.concentrations, function () {
                    $('#wmc_body').append('<p>' + this + '</p>');
                });
            } else if (this.degreeName == 'hcc') {
                $('#hcc_title').append(this.title);
                $.each(this.concentrations, function () {
                    $('#hcc_body').append('<p>' + this + '</p>');
                });
            }

        });
        // add ids to the cards created above
        $('.degrees-undergrad-name').each(function (i) {
            this.id = 'degrees-undergrad-image_' + i;
        });

        /**
         * add icons to the cards
         * I tried to do it dinamically with a loop, but it was adding the tag as a string and not as a tag.
         * Also, .eq(i) in the loop did not work and gave back undefined (even if .eq(0) worked), so I opted out to inserting the icons manually
         */
        $('#degrees-undergrad-image_0').prepend('<i class="fa fa-mobile-alt fa-7x" style="color:#fe2a70; padding-top: 30px; "></i>');
        $('#degrees-undergrad-image_1').prepend('<i class="fa fa-brain fa-7x" style="color:#f8b64d; padding-top: 30px; "></i>');
        $('#degrees-undergrad-image_2').prepend('<i class="fa fa-laptop fa-7x" style="color:#00a2ff; padding-top: 30px;"></i>');

        // add modal targets to the cards
        var degreeName = ['wmc', 'hcc', 'cit'];
        $('.degrees-undergrad-name').each(function (i) {
            this.id = 'target-' + degreeName[i];
        });

        $('#target-wmc').attr('data-target', '#modal_wmc');
        $('#target-cit').attr('data-target', '#modal_cit');
        $('#target-hcc').attr('data-target', '#modal_hcc');

    });

    /** 
     * Graduate 
     */
    xhr('get', {
        path: '/degrees/graduate/'
    }, '#degrees-grad').done(function (json) {
        $.each(json.graduate, function (i, item) {
            // populate modals
            if (this.title !== undefined) {
                $('#degrees-grad').append('<div class="degrees-grad-name card modal_open_staff modal-button"><h5 style = "color: #009CBD;"> ' + this.title + ' </h5></div>');
                $('.degrees-grad-name').eq(i).append('<p class="degrees-grad-description">' + this.description + '</p>');

                if (this.degreeName == 'ist') {
                    $('#ist_title').append(this.title);
                    $.each(this.concentrations, function () {
                        $('#ist_body').append('<p>' + this + '</p>');
                    });
                } else if (this.degreeName == 'hci') {
                    $('#hci_title').append(this.title);
                    $.each(this.concentrations, function () {
                        $('#hci_body').append('<p>' + this + '</p>');
                    });
                } else if (this.degreeName == 'nsa') {
                    $('#nsa_title').append(this.title);
                    $.each(this.concentrations, function () {
                        $('#nsa_body').append('<p>' + this + '</p>');
                    });
                }
            } else {
                $('.grad-advanced-cert').prepend('<h1 id="adv_degree_title">' + this.degreeName + '</h1>');

                $.each(this.availableCertificates, function (i) {
                    $('.adv-cert-content').append('<div id="cert-img_' + i + '" class="grad-advanced-card card" style = "cursor: context-menu;"><h5 style = "color: #009CBD;"> ' + this + ' </h5></div>');
                });
            }

            // add ids
            $('.degrees-grad-name').each(function (i) {
                this.id = 'degrees-grad-image_' + i;
            });

        });

        // add icons
        $('#degrees-grad-image_0').prepend('<i class="fa fa-keyboard fa-7x" style="color:#fe2a70; padding-top: 30px; "></i>');
        $('#degrees-grad-image_1').prepend('<i class="fa fa-users fa-7x" style="color:#f8b64d; padding-top: 30px; "></i>');
        $('#degrees-grad-image_2').prepend('<i class="fa fa-database fa-7x" style="color:#00a2ff; padding-top: 30px;"></i>');
        $('#cert-img_0').prepend('<i class="fab fa-html5 fa-7x" style = "color: #e34f26; padding-top: 30px;"></i>');
        $('#cert-img_1').prepend('<i class="fas fa-project-diagram fa-7x" style = "color: #8c2bd6; padding-top: 30px;"></i>');
        var degreeName = ['ist', 'hci', 'nsa'];
        $('.degrees-grad-name').each(function (i) {
            this.id = 'target-' + degreeName[i];
        });

        //set targets
        $('#target-ist').attr('data-target', '#modal_ist');
        $('#target-hci').attr('data-target', '#modal_hci');
        $('#target-nsa').attr('data-target', '#modal_nsa');

    });

    /**
     * Minors
     */

    xhr('get', {
        path: '/minors/'
    }, '#minors').done(function (json) {
        $.each(json, function () {
            $.each(this, function () {
                // populate modals 
                $('#minors-container').append('<div class="minors-name card modal_open_staff modal-button"><h5 style = "color: #009CBD;"> ' + this.title + ' </h5></div>');
                if (this.name == 'DBDDI-MN') {
                    $('#dbddi_title').append('<p style = "font-size:70%;">' + this.title + '</h1>');
                    $('#dbddi_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function (i, item) {
                        $('#dbddi_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#dbddi_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'GIS-MN') {
                    $('#gis_title').append(this.title);
                    $('#gis_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#gis_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#gis_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'MEDINFO-MN') {
                    $('#med_title').append(this.title);
                    $('#med_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#med_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#med_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'MDDEV-MN') {
                    $('#mddev_title').append(this.title);
                    $('#mddev_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#mddev_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#mddev_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'MDEV-MN') {
                    $('#mdev_title').append(this.title);
                    $('#mdev_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#mdev_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#mdev_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'NETSYS-MN') {
                    $('#netsys_title').append(this.title);
                    $('#netsys_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#netsys_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#netsys_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'WEBDD-MN') {
                    $('#webdd_title').append(this.title);
                    $('#webdd_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#webdd_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#webdd_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                } else if (this.name == 'WEBD-MN') {
                    $('#webd_title').append(this.title);
                    $('#webd_body').append('<p>' + this.description + '</p><br /><span style = "color: black; font-weight: 400;">Courses:</span>');
                    $.each(this.courses, function () {
                        $('#webd_body').append('<p style = "color: #F76902;">' + this + '</p>');
                    });
                    $('#webd_footer').append('<p style = "margin-top: 0.5em; color: red">' + this.note + '</p>');
                }


            });
        });

        // add ids
        $('.minors-name').each(function (i) {
            this.id = 'minors-image_' + i;
        });

        // prepend icons
        $('#minors-image_0').prepend('<i class="fa fa-database fa-5x" style="color:#F5D76E; padding-top: 30px;"></i>');
        $('#minors-image_1').prepend('<i class="fas fa-map-marker-alt fa-5x" style="color:#37AEF0; padding-top: 30px;"></i>');
        $('#minors-image_2').prepend('<i class="fas fa-heartbeat fa-5x" style="color:#019875; padding-top: 30px;"></i>');
        $('#minors-image_3').prepend('<i class="fas fa-code fa-5x" style="color:#6C7A89; padding-top: 30px;"></i>');
        $('#minors-image_4').prepend('<i class="fa fa-mobile-alt fa-5x" style="color:#F27935; padding-top: 30px; "></i>');
        $('#minors-image_5').prepend('<i class="fas fa-project-diagram fa-5x" style = "color: #EB974E; padding-top: 30px;"></i>');
        $('#minors-image_6').prepend('<i class="fab fa-html5 fa-5x" style = "color: #5ED0C9; padding-top: 30px;"></i>');
        $('#minors-image_7').prepend('<i class="fas fa-wifi fa-5x" style = "color: #A9ACAE; padding-top: 30px;"></i>');

        // add ids
        var minorsName = ['dbddi', 'gis', 'med', 'mddev', 'mdev', 'netsys', 'webdd', 'webd'];
        $('.minors-name').each(function (i, item) {
            this.id = 'target-' + minorsName[i];
        });

        //set targets
        $('#target-dbddi').attr('data-target', '#modal_dbddi');
        $('#target-gis').attr('data-target', '#modal_gis');
        $('#target-med').attr('data-target', '#modal_med');
        $('#target-mddev').attr('data-target', '#modal_mddev');
        $('#target-mdev').attr('data-target', '#modal_mdev');
        $('#target-netsys').attr('data-target', '#modal_netsys');
        $('#target-webdd').attr('data-target', '#modal_webdd');
        $('#target-webd').attr('data-target', '#modal_webd');

    });

    /**
     * employment
     */

    xhr('get', {
        path: '/employment/'
    }, '#employment').done(function (json) {
        // add title to section
        $('#employment-container').prepend('<h1 id ="employment_title">' + json.introduction.title + '</h1>');
        $.each(json.introduction.content, function () {
            $('#employment-container').append('<div class="employment_content_title"><h5 class ="emp_title">' + this.title + '</h5></div>');
            $('#employment-container').append('<div class="employment_content">' + this.description + '</div>');
        });

        // build section
        $('#employment-container').append('<div class="degrees_content"><h5 class ="emp_title">' + json.degreeStatistics.title + '</h5><div id = "degree-stats"></div></div>');
        $.each(json.degreeStatistics.statistics, function () {
            $('#degree-stats').append('<div class="degrees-name card"><p style = "font-size: 105%; color: #F76902; padding-bottom: 0.5em; font-weight: 500;"> ' + this.value + '</p><p style = "font-size: 90%; font-weight: 400;">' + this.description + '</p></div>');
        });
        $('#employment-container').append('<div id="employers-container"></div>');
        $('#employment-container').append('<div id="careers-container"></div>');
        $('#employers-container').append('<h5 class ="emp_title">' + json.employers.title + '</h5>');
        $('#employers-container').append('<ul id = "employers-list" class = "ec-list"></ul>');
        $('#careers-container').append('<h5 class ="emp_title">' + json.careers.title + '</h5>');
        $('#careers-container').append('<ul id = "careers-list" class = "ec-list"></ul>');

        $.each(json.employers.employerNames, function () {
            $('#employers-list').append('<li>' + this + '</li');
        });

        $.each(json.careers.careerNames, function () {
            $('#careers-list').append('<li>' + this + '</li');
        });

        $('#employment-container').append('<p style = "padding-top: 2em; font-size: 70%;">*Employers/Careers are randomly pulled from our recent graduates</p>');

        $('#maps').prepend('<h1 id ="map_title">Where our students Work</h1>');

        // add cards which open modal that contain the tables
        $('#tables-container').append('<div class="table-name card"><h5 style = "padding-bottom: 0.5em; font-weight: 500; padding-top: 3em; color: #009CBD;"> ' + json.coopTable.title + '</h5></div>');
        $('#tables-container').append('<div class="table-name card"><h5 style = "padding-bottom: 0.5em; font-weight: 500; padding-top: 3em; color: #009CBD;"> ' + json.employmentTable.title + '</h5></div>');
        $('.table-name').append('<a class="button modal_open_table is-primary modal-button" aria-haspopup="true" style="margin-bottom: 1em; padding-top: 0.3em;">Learn More</a>');

        var tablesName = ['coop', 'emp'];
        // add ids
        $('.modal_open_table').each(function (i, item) {
            this.id = 'target-' + tablesName[i];
        });

        // target the tables
        $('#target-coop').attr('data-target', '#modal_coop');
        $('#target-emp').attr('data-target', '#modal_emp');

        /**
         * method to open the modal. Gets the target associated with the card and adds 
         * the class 'is-active' to the modal div and 'is-clipped' to the html tag
         */
        $('.modal-button').click(function () {
            var target = $(this).data("target");
            $('html').addClass('is-clipped');
            $(target).addClass('is-active');
            $('.delete').click(function () {
                $("html").removeClass("is-clipped");
                $(target).removeClass('is-active');
            });
        });


        // build the tables
        $('#coop_body').append('<table id = "coop_table"><thead><tr><th>Degree</th><th>Employer</th><th>Location</th><th>Term</th></tr></thead><tbody id="coop_table_body"></tbody></table>');
        $('#emp_body').append('<table id = "emp_table"><thead><tr><th>Degree</th><th>Employer</th><th>Location</th><th>Title</th><th>Start Date</th></tr></thead><tbody id="emp_table_body"></tbody></table>');

        // append tables
        $.each(json.coopTable.coopInformation, function (i, item) {
            $("#coop_table_body").append('<tr><td>' + this.degree + '</td><td>' + this.employer + '</td><td>' + this.city + '</td><td>' + this.term + '</td></tr>');
        });

        $.each(json.employmentTable.professionalEmploymentInformation, function (i, item) {
            $("#emp_table_body").append('<tr><td>' + this.degree + '</td><td>' + this.employer + '</td><td>' + this.city + '</td><td>' + this.title + '</td><td>' + this.startDate + '</td></tr>');
        });

        // style function contained in the plugin
        $('#coop_table').DataTable({
            ordering: true
        });

        $('#emp_table').DataTable({
            ordering: true
        });

    });

    /**
     * people
     */
    xhr('get', {
        path: '/people/'
    }, '#people').done(function (json) {
        $('#people').prepend('<h1 id ="people_title">' + json.title + '</h1><h5 id = "people_subtitle">' + json.subTitle + '</h5>');
        var staff = '';
        var faculty = '';
        var modal = '';

        // populate modals and boxes for faculty
        $.each(json.faculty, function () {
            $('#faculty-tab-content').append('<div data-target = "#modal_' + this.username + '" class = "box faculty-box modal_open_staff modal-button"><h5 class = "people_name">' + this.name +
                '</h5><h6 class = "people_image_title">' + this.title + '</h6></div>');

            modal = '<div class = "modal" id = "modal_' + this.username + '"><div class="modal-background"></div><div class="modal-card"><header class="modal-card-head">' +
                '<p class="modal-card-title" id = ' + this.username + '_title">' + this.name + ', <span class ="modal-card-faculty-title">' + this.title + '</span></p><button class="delete" aria-label="close"></button></header>' +
                '<section style = "display: flex;" class="modal-card-body" id = "' + this.username + '_body">' +
                '<div style ="width:50%;"><p>Office: ' + this.office + '</p><p>Interests: ' + this.interestArea + '</p><p>Email: <a href = "mailto:' + this.email + '">' + this.email + '</a></p><p>Phone: ' + this.phone + '</p>' +
                '<p>Username: ' + this.username + '</p><p>Facebook: ' + this.facebook + '</p><p>Twitter: ' + this.twitter + '</p><p>Website: <a target="_blank" href = "' + this.website + '">' + this.website + '</a></p><p>Tagline: ' + this.tagline + '</p>' +
                '</div><div class = "faculty_pic" style ="width:50%;" class="faculty" data-type= "faculty"><img data-uname="' + this.username + '" style = "float: right;  -webkit-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); -moz-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75);" class ="lazyload" style="width:150px" src="' + this.imagePath + '"/></div></section></div></div>';

            $('#people').append(modal);
            // add target
            $('#target-emp').attr('data-target', '#modal_emp');
        });

        // build modals and boxes for staff 
        $.each(json.staff, function () {
            $('#staff-tab-content').append('<div  data-target = "#modal_' + this.username + '" class = "box faculty-box modal_open_staff modal-button"><h5 class = "people_name">' + this.name +
                '</h5><h6 class = "people_image_title">' + this.title + '</h6></div>');

            modal = '<div class = "modal" id = "modal_' + this.username + '"><div class="modal-background"></div><div class="modal-card"><header class="modal-card-head">' +
                '<p class="modal-card-title" id = ' + this.username + '_title">' + this.name + ', <span class ="modal-card-staff-title">' + this.title + '</span></p><button class="delete" aria-label="close"></button></header>' +
                '<section style = "display: flex;" class="modal-card-body" id = "' + this.username + '_body">' +
                '<div style ="width:50%;"><p>Office: ' + this.office + '</p><p>Interests: ' + this.interestArea + '</p><p>Email:<a href = "mailto:' + this.email + '">' + this.email + '</a></p><p>Phone: ' + this.phone + '</p>' +
                '<p>Username: ' + this.username + '</p><p>Facebook: ' + this.facebook + '</p><p>Twitter: ' + this.twitter + '</p><p>Website: <a target="_blank" href = "' + this.website + '">' + this.website + '</a></p><p>Tagline: ' + this.tagline + '</p>' +
                '</div><div style ="width:50%;" class="faculty" data-uname="' + this.username + '" data-type= "staff">' +
                '<img style = "float: right; -webkit-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); -moz-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75);" class ="lazyload" style="width:150px" src="' + this.imagePath + '"/></div></section></div></div>';

            $('#people').append(modal);
            $('#target-emp').attr('data-target', '#modal_emp');
        });

        $('.faculty').on('click', function () {
            var me = getAttributesByName(json.faculty, 'username', $(this).attr('data-uname'));
        });

        // add image to modal
        $.each(json.staff, function () {
            staff += '<div class="staff" data-uname="' + this.username +
                '" data-type= "staff"><h5 class = "people_name">' + this.name +
                '</h5><img class ="lazyload" style="width:150px" src="' + this.imagePath + '"/></div>';
        })

        $('.staff').on('click', function () {
            var me = getAttributesByName(json.staff, 'username', $(this).attr('data-uname'));
        });


    });


    /**
     * research
     */

    xhr('get', {
        path: '/research/'
    }, '#research').done(function (json) {
        var modalInterest = '';
        var modalFaculty = '';
        // array of icons
        var icons = ['<i class="fas fa-user fa-5x" style = "color: #3498DB; padding-top: 30px;"></i>', '<i class="fas fa-pen-square fa fa-5x" style="color:#F64747; padding-top: 30px;"></i>',
            '<i class="fas fa-map-marker-alt fa-5x" aria-hidden="true" style="color:#E08283; padding-top: 30px;"></i>', '<i class="fas fa-database fa-5x" style="color:#22313F; padding-top: 30px;"></i>',
            '<i class="fab fa-gg fa-5x" style="color:#F4B350; padding-top: 30px;"></i>', '<i class="fas fa-object-group fa-5x" style="color:#D64541; padding-top: 30px;"></i>',
            '<i class="fa fa-project-diagram fa-5x" style="color:#68C3A3; padding-top: 30px;"></i>', '<i class="fa fa-mobile-alt fa-5x" style="color:#6C7A89; padding-top: 30px;"></i>',
            '<i class="fa fa-heartbeat fa-5x" style="color:#019875; padding-top: 30px;"></i>', '<i class="fas fa-file-code fa-5x" style="color:#F2784B; padding-top: 30px;"></i>',
            '<i class="fas fa-server fa-5x" style="color:#3A539B; padding-top: 30px;"></i>', '<i class="fas fa-caret-square-right fa-5x" style="color:#34495E; padding-top: 30px;"></i>'
        ];

        // add title and subtitle to research subsections
        $('#research_interest').prepend('<h1 id ="interest_title">Faculty Research: Areas of Interest</h1><h5 id = "interest_subtitle">Click the area you’re interested in to explore our faculty publications</h5>');
        $('#research_faculty').prepend('<h1 id ="faculty_title">Faculty Research: Lookup by Faculty</h1><h5 id = "faculty_subtitle">Click the faculty member to explore their recent publications</h5>');
        $.each(json.byInterestArea, function (i, item) {

            // add box
            $('#interest-container').append('<div data-target = "#modal_' + this.areaName.substring(0, 4) + '"class = "box interest-box modal_open_staff modal-button"><h5 class = "interest_name">' + this.areaName +
                '</h5></div>');

            // build and add modal
            modalInterest = '<div id="modal_' + this.areaName.substring(0, 4) + '" class="modal">' +
                '<div class="modal-background"></div>' +
                '<div class="modal-card">' +
                '<header class="modal-card-head">' +
                '<p class="modal-card-title" id="' + this.areaName.substring(0, 4) + '_title">Research By Domain Area: ' + this.areaName + '</p>' +
                '<button class="delete" aria-label="close"></button></header>' +
                '<section class="modal-card-body" id="' + this.areaName.substring(0, 4) + '_body"><ul style = "list-style-type: circle;" class= "interest-list">';
            $.each(this.citations, function () {
                modalInterest += '<li style = "margin-left: 0.3em;">' + this + '</li>';
            });
            modalInterest += '</ul></section></div></div>';

            $('#research').append(modalInterest);
        });

        $.each(json.byFaculty, function (i, item) {

            // add box
            $('#faculty-container').append('<div data-target = "#modal_' + this.username.substring(0, 4) + '"class = "box faculty-box modal_open_staff modal-button"><h5 class = "interest_name">' + this.facultyName +
                '</h5></div>');

            // build and add modal
            modalFaculty = '<div id="modal_' + this.username.substring(0, 4) + '" class="modal">' +
                '<div class="modal-background"></div>' +
                '<div class="modal-card">' +
                '<header class="modal-card-head">' +
                '<p class="modal-card-title" id="' + this.username.substring(0, 4) + '_title">' + this.facultyName + '</p>' +
                '<button class="delete" aria-label="close"></button></header>' +
                '<section style = "display: block;" class="modal-card-body" id="' + this.username.substring(0, 4) + '_body"><div style = "width: 100%;">';
            modalFaculty += '<img src = "' + $('[data-uname = "' + this.username + '"]').attr('src') + '" style = "float: right;  -webkit-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); -moz-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); width:150px;" class ="lazyload" />';
            modalFaculty += '</div><div><ul style = "list-style-type: circle;" class= "interest-list">';
            $.each(this.citations, function () {
                modalFaculty += '<li style = "margin-left: 0.3em;">' + this + '</li>';
            });
            modalFaculty += '</ul></div></section></div></div>';

            $('#research').append(modalFaculty);
        });

        // add icons
        $('.interest-box').eq(0).prepend(icons[0]);
        $('.interest-box').eq(1).prepend(icons[1]);
        $('.interest-box').eq(2).prepend(icons[2]);
        $('.interest-box').eq(3).prepend(icons[3]);
        $('.interest-box').eq(4).prepend(icons[4]);
        $('.interest-box').eq(5).prepend(icons[5]);
        $('.interest-box').eq(6).prepend(icons[6]);
        $('.interest-box').eq(7).prepend(icons[7]);
        $('.interest-box').eq(8).prepend(icons[8]);
        $('.interest-box').eq(9).prepend(icons[9]);
        $('.interest-box').eq(10).prepend(icons[10]);
        $('.interest-box').eq(11).prepend(icons[11]);
        $('.interest-box').eq(12).prepend(icons[12]);


    });



    /**
     * resources
     */
    xhr('get', {
        path: '/resources/'
    }, '#resources').done(function (json) {
        // add title
        $('#resources').prepend('<div><h1 id ="resources_title">' + json.title + '</h1><h5 id = "resources_subtitle">' + json.subTitle + '</h5></div>');

        // add boxes
        $('#resources-content').append('<div data-target = "#modal_resource_coop" class = "box resources-box modal_open_staff modal-button"><h1 class = "resources_title_box">' + json.coopEnrollment.title + '</h1></div>');
        $('#resources-content').append('<div data-target = "#modal_forms" class = "box resources-box modal_open_staff modal-button"><h1 class = "resources_title_box">Forms</h1></div>');
        $('#resources-content').append('<div data-target = "#modal_ambassador" class = "box resources-box modal_open_staff modal-button"><h1 class = "resources_title_box">' + json.studentAmbassadors.title + '</h1></div>');
        $('#resources-content').append('<div data-target = "#modal_student_services" class = "box resources-box modal_open_staff modal-button"><h1 class = "resources_title_box">' + json.studentServices.title + '</h1></div>');
        $('#resources-content').append('<div data-target = "#modal_abroad" class = "box resources-box modal_open_staff modal-button"><h1 class = "resources_title_box">' + json.studyAbroad.title + '</h1></div>');
        $('#resources-content').append('<div data-target = "#modal_tutor" class = "box resources-box modal_open_staff modal-button"><h1 class = "resources_title_box">' + json.tutorsAndLabInformation.title + '</h1></div>');

        // build modals
        var coopModal = '<div id="modal_resource_coop" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="resource_coop_title">' + json.coopEnrollment.title + '</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="resource_coop_body"><div>';
        $.each(json.coopEnrollment.enrollmentInformationContent, function () {
            coopModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; ">' + this.title + '</h1><p>' + this.description + '</p>';
        });
        coopModal += '<a href = "' + json.coopEnrollment.RITJobZoneGuideLink + '" style = "padding-top: 0.3em; font-weight: 400; font-style: oblique;">RITJobZoneGuideLink</a></div></section></div></div>';


        var formsModal = '<div id="modal_forms" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="forms_title">Forms</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="forms_body"><div>';
        $.each(json.forms.graduateForms, function () {
            formsModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + this.formName + '</h1><a href = "' + this.href + '">' + this.href + '</a>';
        });

        $.each(json.forms.undergraduateForms, function () {
            formsModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + this.formName + '</h1><a href = "' + this.href + '">' + this.href + '</a>';
        });
        formsModal += '</div></section></div></div>';


        var ambassadorModal = '<div id="modal_ambassador" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="ambassador_title">' + json.studentAmbassadors.title + '</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="ambassador_body"><div>';
        ambassadorModal += '<img src = "' + json.studentAmbassadors.ambassadorsImageSource + '" style = "-webkit-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); -moz-box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); box-shadow: 6px 3px 15px -4px rgba(0,0,0,0.75); width:400px;" />';
        $.each(json.studentAmbassadors.subSectionContent, function () {
            ambassadorModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + this.title + '</h1><p>' + this.description + '</p>';
        });
        ambassadorModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">Notes</h1><p>' + json.studentAmbassadors.note + '</p>';
        ambassadorModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">Link</h1><a href = "' + json.studentAmbassadors.applicationFormLink + '" style = "color: #009CBD;">' + json.studentAmbassadors.applicationFormLink + '</a>';
        ambassadorModal += '</div></section></div></div>';


        var studentServicesModal = '<div id="modal_student_services" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="student_services_title">' + json.studentServices.title + '</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="student_services_body"><div>';


        studentServicesModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + json.studentServices.academicAdvisors.title + '</h1>';
        studentServicesModal += '<p>' + json.studentServices.academicAdvisors.description + '</p>';
        studentServicesModal += '<a href = "' + json.studentServices.academicAdvisors.faq.title + '" style = "font-size: 110%; font-weight: bold; color: #009CBD; padding-bottom: 0.4em;">' + json.studentServices.academicAdvisors.faq.title + '</a>';


        studentServicesModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + json.studentServices.facultyAdvisors.title + '</h1>';
        studentServicesModal += '<p>' + json.studentServices.facultyAdvisors.description + '</p>';

        studentServicesModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + json.studentServices.istMinorAdvising.title + '</h1>';
        $.each(json.studentServices.istMinorAdvising.minorAdvisorInformation, function () {
            studentServicesModal += '<h1 style = "font-size: 110%; font-weight: bold; color: #009CBD; padding-bottom: 0.4em;">' + this.title + '</h1>';
            studentServicesModal += '<p>' + this.advisor + '</p><a href ="mailto:' + this.email + '" style = "padding-bottom: 0.4em;">' + this.email + '</a></p>';
        });

        studentServicesModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + json.studentServices.professonalAdvisors.title + '</h1>';
        $.each(json.studentServices.professonalAdvisors.advisorInformation, function () {
            studentServicesModal += '<h1 style = "font-size: 110%; font-weight: bold; color: #009CBD; padding-bottom: 0.4em;">' + this.department + '</h1>';
            studentServicesModal += '<p>' + this.name + '</p><a href ="mailto:' + this.email + '" style = "padding-bottom: 0.4em;">' + this.email + '</a></p>';
        });
        studentServicesModal += '</div></section></div></div>';



        var abroadModal = '<div id="modal_abroad" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="abroad_title">' + json.studyAbroad.title + '</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="abroad_body"><div>';

        abroadModal += '<p>' + json.studyAbroad.description + '</p>';

        $.each(json.studyAbroad.places, function () {
            abroadModal += '<h1 style = "font-size: 150%; color: #F76902; font-weight: bold; padding-bottom: 0.4em;">' + this.nameOfPlace + '</h1>';
            abroadModal += '<p style = "padding-bottom: 0.4em;">' + this.description + '</p>';
        });
        abroadModal += '</div></section></div></div>';


        var tutorModal = '<div id="modal_tutor" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="tutor_title">' + json.tutorsAndLabInformation.title + '</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="tutor_body"><div>';
        tutorModal += '<p>' + json.tutorsAndLabInformation.description + '</p>';
        tutorModal += '<a href ="' + json.tutorsAndLabInformation.tutoringLabHoursLink + '" style = "padding-bottom: 0.4em;">' + json.tutorsAndLabInformation.tutoringLabHoursLink + '</a>';
        tutorModal += '</div></section></div></div>';


        // add modals to resources
        $('#resources').append(coopModal);
        $('#resources').append(formsModal);
        $('#resources').append(ambassadorModal);
        $('#resources').append(studentServicesModal);
        $('#resources').append(abroadModal);
        $('#resources').append(tutorModal);

    });

    /**
     * news
     * The API contains only the "older" sections. Even by using the example in the API website
     * I could not find a "year" section
     */
    xhr('get', {
        path: '/news/'
    }, '#news').done(function (json) {

        // add <a> tag that opens modal
        $('#news').append('<div><a data-target = "#modal_news" class="modal_open_staff modal-button" aria-haspopup="true" style="margin-bottom: 1em; text-decoration: underline; font-size: 150%;">Older News</a><div>');

        // build and add modal
        var newsModal = '<div id="modal_news" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="news_title">News</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="abroad_news"><div>';
        $.each(json.older, function (i, item) {
            newsModal += '<h1 style = "font-size: 140%; font-weight: bold; color: #F76902;">' + this.title + '</h1>';
            newsModal += '<h3 style = "font-style: oblique; font-size: 110%; color: #009CBD;">' + this.date + '</h3>';
            newsModal += '<p>' + this.description + '</p>';
            newsModal += '<br />';
        });
        newsModal += '</div></section></div></div>';


        $('#footer').append(newsModal);
    });

    /**
     * footer
     */
    xhr('get', {
        path: '/footer/'
    }, '#footer').done(function (json) {
        // add div containing social information
        $('#social').append('<h1 id = "social_title">' + json.social.title + '</h1>');
        $('#social').append('<p id = "social_subtitle">' + json.social.tweet + '</p>');
        $('#social').append('<p id = "social_by">' + json.social.by + '</p>');
        $('#social').append('<div id ="social_icons"><a href = "' + json.social.facebook + '" class = "social_icons"><i class="fab fa-facebook-f fa-3x" style = "color: #3b5998;"></i></a><a href = "' + json.social.twitter + '" class = "social_icons"><i class="fab fa-twitter fa-3x" style = "color: #00acee;"></i></a></div>');

        // add links
        $.each(json.quickLinks, function () {
            $('#quick_links').append('<div><a style = "padding-bottom: 0.5em; text-decoration: underline; font-size: 150%;" href = "' + this.href + '">' + this.title + '</a></div>');
        });
        $('#quick_links').append('<div><a data-target = "#modal_contact" class = "modal_open_table modal-button" style = "padding-bottom: 0.5em; text-decoration: underline; font-size: 150%;">Contact Us</a></div>');

        // build and add modal for contact form
        var newsModal = '<div id="modal_contact" class="modal">' +
            '<div class="modal-background"></div>' +
            '<div class="modal-card">' +
            '<header class="modal-card-head">' +
            '<p class="modal-card-title" id="contact_title">Contact Form</p>' +
            '<button class="delete" aria-label="close"></button></header>' +
            '<section style = "display: block;" class="modal-card-body" id="abroad_contact"><div>';
        newsModal += '<iframe class="frame" style="-webkit-transform:scale(1);-moz-transform:scale(1); padding-top: 1em;" src="http://ist.rit.edu/api/contactForm.php"></iframe>';
        newsModal += '</div></section></div></div>';

        $('#footer').append(newsModal);

        // add copyright
        $('#copyright').append(json.copyright.html);

        // add news (this does not work. When I click on the link it says that the page does not exist)
        $('#news').prepend('<div><a href = "' + json.news + '" target = "_blank" style = "padding-bottom: 0.5em; text-decoration: underline; font-size: 150%;">News</a><div>');
    });


});