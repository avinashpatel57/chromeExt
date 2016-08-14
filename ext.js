document.addEventListener('DOMContentLoaded', function () {
    var fetchButton = document.getElementById('fetchinfo');

    fetchButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            d = document;

            chrome.tabs.executeScript(
                null,
                {
                    code: '\
					var website = window.location.hostname.split(\'.\')[1];\
					var names = [], phone = [], address = [], type = [], est_year = [], image = [];\
					var regex = new RegExp(\',\', \'g\');\
					if(website == \'justdial\'){\
					    var all_stores = document.getElementsByClassName(\'rsl\')[0].getElementsByClassName(\'cntanr\');\
					    for(var i=0; i < all_stores.length; i++){\
					        var temp = all_stores[i].getElementsByClassName(\'store-details\')[0];\
					        names[i] = temp.getElementsByClassName(\'store-name\')[0].getElementsByClassName(\'jcn\')[0].getElementsByTagName(\'a\')[0].title.replace(regex, \'\');\
							phone[i] = temp.getElementsByClassName(\'contact-info\')[0].getElementsByTagName(\'a\')[0].innerText.replace(regex, \'\');\
							address[i] = temp.getElementsByClassName(\'address-info\')[0].getElementsByClassName(\'desk-add jaddt\')[0].getElementsByTagName(\'a\')[0].getElementsByClassName(\'mrehover\')[0].innerText.trim().replace(regex, \'\');\
					        \
							type[i] = temp.getElementsByClassName(\'adinfoex\')[0].getElementsByClassName(\'bld\')[0].innerText.replace(regex, \'\');\
							type[i] = type[i] + \' \' + temp.getElementsByClassName(\'adinfoex\')[0].getElementsByTagName(\'a\')[0].title.replace(regex, \'\');\
							est_year[i] = temp.getElementsByClassName(\'est-info ipadabove\')[0].getElementsByClassName(\'year\')[0].innerText;\
							\
					        var img_data = all_stores[i].getElementsByClassName(\'thumb_img\')[0].getElementsByClassName(\'lazy clogo\')[0];\
						    if(img_data){\
                                image[i] = img_data.getAttribute(\'data-original\');\
                            } else {\
                                image[i] = \'\';\
                            }\
					    }\
					    var r = [names, phone, address, type, est_year, image];\
					} else {\
					    var r = [];\
					}\
					r;\
					'
                },
                function (results) {
                    if (results == null || results[0] == null || results[0].length == 0) {
                        alert('Sopmething went wrong !!');
                        return false;
                    }
                    var result = results[0];
                    var all_data = [];
                    for (var inner_index = 0; inner_index < result[0].length; inner_index++) {
                        var temp = [];
                        for (var index = 0; index < result.length; index++) {
                            temp.push(result[index][inner_index]);
                        }
                        all_data[inner_index] = temp.join(', ');
                    }
                    var csv_string = all_data.join('\n');
                    var link_element = document.createElement('a');
                    link_element.href = 'data:attachment/csv,' + encodeURIComponent(csv_string);

                    link_element.target = '_blank';
                    link_element.download = 'getAdda_warehouses.csv';
                    document.body.appendChild(link_element);

                    link_element.click();
                }
            );
        });
    }, false);
}, false);
