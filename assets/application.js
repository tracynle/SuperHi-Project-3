$(document).ready(function() {
    // Currency Global variables
    let 
        moneySpanSelector = 'span.money',
        currencyPickerSelector = '[name=currencies]';

    let currencyPicker = {
        loadCurrency: function() {
            /* Fix for customer account pages */
            $(moneySpanSelector + ' ' + moneySpanSelector).each(function () {
                $(this).parents(moneySpanSelector).removeClass('money');
            });

            /* Saving the current price */
            $(moneySpanSelector).each(function () {
                $(this).attr('data-currency-' + shopCurrency , $(this).html());
            });

            // If there's no cookie.
            if (cookieCurrency == null) {
                if (shopCurrency !== defaultCurrency) {
                    Currency.convertAll(shopCurrency, defaultCurrency);
                }
                else {
                    Currency.currentCurrency = defaultCurrency;
                }
            }

            // If the cookie value does not correspond to any value in the currency dropdown.
            else if ($(currencyPickerSelector).length && $(currencyPickerSelector +  'option[value=' + cookieCurrency + ']').length === 0) {
                Currency.currentCurrency = shopCurrency;
                Currency.cookie.write(shopCurrency);
            }
            else if (cookieCurrency === shopCurrency) {
                Currency.currentCurrency = shopCurrency;
            }
            else {
                Currency.convertAll(shopCurrency, cookieCurrency);
            }
        },
        onCurrencyChanged: function(event) {
            let 
                newCurrency = $(this).val();
                $otherPickers = $(currencyPickerSelector).not($(this)); // return other currency pickers thats not the one that has been changed
            Currency.convertAll(Currency.currentCurrency, newCurrency);

            if ($otherPickers.length > 0) {
                $otherPickers.val(newCurrency);
            }
        },
        onMoneySpanAdded: function() {
            Currency.convertAll(shopCurrency, Currency.currentCurrency);
        },
        init: function() {
            if (showMultipleCurrencies !== true) {
                return false;
            }
            currencyPicker.loadCurrency();

            $(document).on('change', currencyPickerSelector, currencyPicker.onCurrencyChanged);
        }
    };
   
    currencyPicker.init();
});