var sCalendar = (function(){

    const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const MONTHS = [ ['Jan', 31], ['Feb', 28, 29], ['Mar', 31], 
                     ['Apr', 30], ['May', 31], ['Jun', 30], 
                     ['Jul', 31], ['Aug', 31], ['Sep', 30], 
                     ['Oct', 31], ['Nov', 30], ['Dec', 31] ];

    const TODAY = new Date();
    const TODAY_INFO = [TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()];

    const CLASS = {
        'normal' : 'cal-normal',
        'today' : 'cal-today',
        'other' : 'cal-other-month',
        'unusable' : 'cal-unusable',
        'selected' : 'cal-selected',
        'row' : 'cal-row',
        'header' : 'cal-header',
        'button' : 'cal-button',
        'label' : 'cal-label',
        'prev' : 'cal-prev',
        'next' : 'cal-next',
        'days' : 'cal-days',
        'dates' : 'cal-dates'
    }

    const ROWS = 6;
    const COLS = 7;


    function sCalendar(parent){
        this.container = sQ(parent);
        this.buildHeader().buildBody();
    }

    sCalendar.prototype.buildHeader = function(){
        this.container.createChild('div', {'class' : CLASS.header}, 0)
            .children()
            .createChild('div', {'class' : CLASS.button + ' ' + CLASS.prev})
            .createChild('div', {'class' : CLASS.label})
            .createChild('div', {'class' : CLASS.button + ' ' + CLASS.next});
        
        let days_container = this.container.createChild('div', {'class' : CLASS.days}, 0)
            .children().last();

        DAYS.forEach(function(day){
            days_container.createChild('div', null, 0, day)
        });

        return this;
    }

    sCalendar.prototype.buildBody = function(){
        this.container.createChild('div', {'class' : CLASS.dates});
        let dates_container = this.container.children().last();

        for(let i = 0; i < ROWS; i++){
            dates_container.createChild('div', {'class' : CLASS.row});
        }

        let dates_row = dates_container.children();

        dates_row.each(function(el){
            for(let i = 0; i < COLS; i++){
                el.createChild('div', {'class' : CLASS.normal}, 0, '1');
            }
        });

        return this;
    }



    return sCalendar;


})();