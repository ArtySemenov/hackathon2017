var formBuilder = function (formElement) {
    function AJAX_JSON_Req(url) {
        var AJAX_req = new XMLHttpRequest();
        AJAX_req.open("GET", url, true);
        AJAX_req.setRequestHeader("Content-type", "application/json");
        AJAX_req.onreadystatechange = function () {
            if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {
                var response = JSON.parse(AJAX_req.responseText);
                formWrapperBuilder(response);
            }
        }
        AJAX_req.send();
    };
    AJAX_JSON_Req(formElement.getAttribute('data-question-src'));

    var collapseFormWrapper = function(el,collapse){
        if( !collapse ){
            el.classList.remove('collapsed');
            el.style.height = el.scrollHeight +'px';
        } else if( collapse ){
            el.classList.add('collapsed');
            el.style.height = '68px';
        }
    };

    var formWrapperBuilder = function (formData) {
        formData.forEach(function (el, i) {

            //var renderedQuestions = 0;
            var formWrapper = document.createElement('fieldset');
            if( el.collapsable ){
                formWrapper.classList.add('collapsable');
                formWrapper.addEventListener('click',function(){
                    if( this.classList.contains('collapsed')){
                        collapseFormWrapper(this,false);
                    } else if( !this.classList.contains('collapsed')){
                        collapseFormWrapper(this,true);
                    }
                });
            }
            if( el.collapsed ){
                formWrapper.classList.add('collapsed');
            }
            if( el.hidden ){
                formWrapper.classList.add('hidden');
            }
            if( el.legend ){
                var formTitle = document.createElement('legend');
                var formName = el.legend;
                formTitle.textContent = formName;
                formWrapper.appendChild(formTitle);
            }
            if( el.title ){
                var formTitle = document.createElement('h2');
                formTitle.classList.add('sticky-form-heading');
                var formName = el.title;
                formTitle.textContent = formName;
                formElement.appendChild(formTitle);
            }

            if( el.hidden ){
                formWrapper.className = 'hidden row-'+el.id;
            }

            if( el.content ){
                formWrapper.appendChild(buildContent(el.content));
            }

            if( el.questions ){
                var formQuestionWrap = document.createElement('ol');
                console.log('This is question set ' + i + '. There are '+ el.questions.length +' questions');
                formWrapper.appendChild(formQuestionWrap);
                var setId = i;
                el.questions.forEach(function (questionData, j, formWrapper) {
                    formQuestionWrap.appendChild(formQuestionBuilder(questionData, j, setId));
                });
            }

            setTimeout(function(){

                if( formWrapper.classList.contains('collapsed')){
                        collapseFormWrapper(formWrapper,true);
                    } else if( !formWrapper.classList.contains('collapsed')){
                        collapseFormWrapper(formWrapper,false);
                    }
            },1000);

            formElement.appendChild(formWrapper);


        });
        console.log('All questions rendered');


    };


    var buildContent = function(contentData){
        var contentWrapper = document.createElement('div');
        contentWrapper.innerHTML = contentData;
        return contentWrapper;
    };


    var buildTextList = function(contentData){
        var contentWrapper = document.createElement('ul');
        contentWrapper.className = "assumptions-list";
        var listItems = contentData.split('|');
        //console.log(listItems);
        listItems.forEach(function(el,i){
            //console.log(el);
            var listItem = document.createElement('li');
            listItem.innerText = el;
            contentWrapper.appendChild(listItem);
        });
        return contentWrapper;
    };

    var formQuestionBuilder = function (obj, i, setId) {
        var questionRow = document.createElement('li');
        var questionWrap = document.createElement('div');
        var answerWrap = document.createElement('div');

        questionRow.appendChild(questionWrap);
        questionRow.appendChild(answerWrap);

        function buildHelp() {
            function buildHelpElement(e, c, t) {
                var element = document.createElement(e);
                element.className = c;
                if (t) {
                    element.textContent = obj.helpText;
                }
                return element;
            };
            var helpTrigger = buildHelpElement('span', 'help-trigger');
            if(obj.helpTrigger){
                helpTrigger.textContent = obj.helpTrigger;
                helpTrigger.classList.add('text-trigger');
            }
            var helpWrapper = buildHelpElement('div', 'help-wrap');
            var helpMessage = buildHelpElement('div', 'help-msg');

            if( obj.helpText.indexOf('|') > 0 ){
                var helpText = buildTextList(obj.helpText);
            } else {
                var helpText = buildHelpElement('p', 'help-text', obj.helpText);
            }



            helpTrigger.addEventListener('click',function(){
                questionRow.classList.toggle('help-open');
                if( !questionRow.classList.contains('help-open') ){
                    helpWrapper.style.height = '0px';
                } else if( questionRow.classList.contains('help-open') ){
                    helpWrapper.style.height = helpWrapper.scrollHeight+'px';
                }

            });
            helpMessage.appendChild(helpText);
            helpWrapper.appendChild(helpMessage);
            questionWrap.appendChild(helpTrigger);
            questionWrap.appendChild(helpWrapper);
        };

        function buildHint() {
            var hint = document.createElement('small');
            hint.textContent = obj.hint;
            questionWrap.appendChild(hint);
        };

        function buildError(errorText) {
            var errorElement = document.createElement('p');
            errorElement.className = 'error';
            errorElement.textContent = errorText;
            questionWrap.appendChild(errorElement);
            questionWrap.insertBefore(errorElement, questionWrap.firstElementChild);
            questionRow.classList.add('error-row');
        };

        var emailValidation = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        var getClosestError = function ( element, selector ) {
            for ( ; element && element !== document && element.nodeType === 1; element = element.parentNode ) {
                //if ( element.tagName.toLowerCase() === selector && element.classList.contains('error-row')) {
                if ( element.tagName.toLowerCase() === selector ) {
                    return true;
                }
            }
            return false;
        };

        function captureEvents(input) {
            input.addEventListener('change', function (evt) {

                // Store input values
                var storageKey;
                if (input.type === 'radio') {
                    storageKey = this.name;
                } else {
                    storageKey = this.id;
                }
                localStorage.setItem(storageKey, this.value);

                // Show/hide dependant form elements
                if (input.getAttribute('data-hide')) {
                    var targetRow = document.body.querySelector('.row-' + input.getAttribute('data-hide'));
                    targetRow.classList.add('hidden');
                }
                if (input.getAttribute('data-show')) {
                    var targetRow = document.body.querySelector('.row-' + input.getAttribute('data-show'));
                    targetRow.classList.remove('hidden');
                }

                if (input.getAttribute('required')) {
                    if( input.value !== '' || input.value !== null || input.checked ){
                        console.info(input.id +' is required and has value');
                        requiredValidationStyling(questionRow,false);
                    }
                }

                // Specific form element validation
                if (obj.validation) {
                    obj.validation.forEach(function (validationScript) {
                        if (!eval(validationScript.validationTest)(input.value)) {
                            console.error(input.id + ' value is invalid: ' + input.value);
                            buildError(validationScript.errorText);
                            input.value = '';
                            input.focus();
                        } else {
                            console.info('input ' + input.id + ' is valid');
                            if( getClosestError(input,'li') ){
                                questionWrap.removeChild(questionWrap.querySelector('.error'));
                                requiredValidationStyling(questionRow,false);
                            }
                        }
                    });
                }
            });

            /*
            var requiredValidation = function(valElement,valParent){
                console.log(valElement);
                console.log(valParent);
            };
            */

            // Add/Remove required row error styling
            var requiredValidationStyling = function(row,addStyle){
                if( addStyle ){
                    row.classList.add('error-row');
                } else if( !addStyle ){
                    row.classList.remove('error-row');
                }
            };



            input.addEventListener('click', function (evt) {
                if( input.type === 'submit' ){
                    evt.preventDefault();


                    var requiredFields = document.getElementsByTagName('form')[0].elements;

                     for( i = 0; i < requiredFields.length; i++ ){
                        var requiredElement = requiredFields[i];

                        if( requiredElement.required && requiredElement.type !== 'radio' ){
                            var parentEl = requiredElement.offsetParent.parentElement;
                            if( requiredElement.value === '' || requiredElement.value === null ){
                                console.error(requiredElement.id + ' currently has no value but is required');
                                requiredValidationStyling(parentEl,true);
                            } else {
                                console.info(requiredElement.id + ' has the value of ' + requiredElement.value);
                                requiredValidationStyling(parentEl,false);
                            }
                        } else if( requiredElement.required && requiredElement.type === 'radio' ){
                            if( !requiredElement.checked ){
                                var parentEl = requiredElement.offsetParent.parentElement;
                                var radioName = requiredElement.name;
                                var requiredRadioGroup = document.getElementsByName(radioName);
                                var anyChecked = false;
                                var runPostValidation = true;
                                for( j = 0; j < requiredRadioGroup.length; j++ ){
                                    if(requiredRadioGroup[j].checked){
                                        console.info(requiredElement.id + ' is checked and is required');
                                        anyChecked = true;

                                    }
                                }
                                if(!anyChecked){
                                    if(runPostValidation){
                                        runPostValidation = false;
                                        console.error(radioName +' is unchecked but required');
                                        requiredValidationStyling(parentEl,true);
                                    }
                                } else if( anyChecked){
                                    requiredValidationStyling(parentEl,false);
                                }
                            }
                        }
                    }
                    if(!document.body.querySelector('.error-row')){

                        eval(obj.functionName)

                    } else {
                        console.error('Form still has empty required elements');
                    }


                }

            });
        };

        var appendFunction = function(el,evtType,f){
            el.addEventListener(evtType,function(evt){
                eval(f);
            });
        };

        function buildLabel(questionId, labelText) {
            var formLabel = document.createElement('label');
            formLabel.setAttribute('for', questionId);
            formLabel.innerHTML = labelText;
            return formLabel;
        };

        function buildButton(buttonText,buttonId) {
            var button = document.createElement('button');
            button.className = 'btn';
            button.textContent = buttonText;
            button.id = buttonId
            return button;
        };

        function buildInput(inputType, inputId) {
            var input = document.createElement('input');
            input.setAttribute('type', inputType);

            input.id = inputId;
            if (obj.placeholder) {
                input.setAttribute('placeholder', obj.placeholder);
            }
            if (obj.value) {
                input.setAttribute('value', obj.value);
            }
            if(obj.required){
                input.setAttribute('required','required');
            }
            if( obj.functionName ){
                appendFunction(input,obj.functionTrigger,obj.functionName);
            } else {
                captureEvents(input);
            }

            return input;
        };

        var buildGroup = function(){

            var questionList = document.createElement('ol');
            var groupId = 'group-' + setId + '-' + i;
            obj.input.forEach(function (input, i) {
                var listItem = document.createElement('li');
                var inputElementId = groupId + '-' + i;
                var inputElement = buildInput(obj.type, inputElementId);
                inputElement.setAttribute('name', groupId);
                inputElement.setAttribute('value', input.value);
                if (input.triggerShow) {
                    inputElement.setAttribute('data-show', input.triggerShow);
                } else if (input.triggerHide) {
                    inputElement.setAttribute('data-hide', input.triggerHide);
                }
                if(obj.required){
                    inputElement.setAttribute('required','required');
                }
                var inputLabel = buildLabel(inputElementId, input.label);
                inputLabel.className = 'pseudo-radio';
                listItem.appendChild(inputElement);
                listItem.appendChild(inputLabel);
                questionList.appendChild(listItem);
                captureEvents(inputElement);
            });
            return questionList;
        };

        function buildSelect(inputId) {
            var selectWrapper = document.createElement('div');
            selectWrapper.className = 'pseudo-select';
            var selectElement = document.createElement('select');
            selectElement.id = inputId;
            obj.option.forEach(function (option, i) {
                var optionElement = document.createElement('option');
                optionElement.text = option.text;
                optionElement.setAttribute('value', option.value);
                selectElement.appendChild(optionElement);
            });
            selectWrapper.appendChild(selectElement);
            if(obj.required){
                selectElement.setAttribute('required','required');
            }
            captureEvents(selectElement);
            return selectWrapper;
        };




        if (obj.type === 'text' || obj.type === 'date' || obj.type === 'tel' || obj.type === 'email' || obj.type === 'select' || obj.type === 'submit' || obj.type === 'radio' || obj.type === 'checkbox') {

            if (obj.id) {
                var inputId = obj.id;
            } else if (!obj.id) {
                var inputId = 'input-' + setId + '-' + i;
            }


            if (obj.type === 'radio' || obj.type === 'checkbox' ) {
                if(obj.class){
                    answerWrap.classList.add('inline');
                }
                var pseudoLabel = document.createElement('p');
                pseudoLabel.className = 'label';
                pseudoLabel.textContent = obj.label;
                questionWrap.appendChild(pseudoLabel);
                if(obj.list){
                    questionWrap.appendChild(buildTextList(obj.list));
                }
                answerWrap.appendChild(buildGroup());
            } else if (obj.type != 'radio' || obj.type != 'checkbox') {
                if (obj.label) {
                    questionWrap.appendChild(buildLabel(inputId, obj.label));
                }
                if (obj.type != 'select') {
                    answerWrap.appendChild(buildInput(obj.type, inputId));
                } else if (obj.type === 'select') {
                    answerWrap.appendChild(buildSelect(inputId));
                }
            }
            if (obj.helpText) {
                buildHelp();
            }
            if (obj.hint) {
                buildHint();
            }
            if (obj.dependant) {
//                var dependants = document.getElementsByTagName('form')[0].elements;
//
//                 for( i = 0; i < requiredFields.length; i++ ){
//                 }
                questionRow.classList.add('row-' + inputId);
            }
            if (obj.hidden) {
                questionRow.classList.add('hidden');
            }
            if (obj.required) {
                questionRow.classList.add('required');
            }
        } else if( obj.type === 'button' ){
            console.info('pseudo submit present');
            answerWrap.appendChild(buildButton(obj.value,obj.id));
        } else if( obj.type === 'inline-checkbox' ){
            console.log('inline checkbox');


        }



        return questionRow;
    }

};



formBuilder(document.getElementsByTagName('form')[0]);
