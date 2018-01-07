var STATUS = {
    LOCKED: 'locked',
    UNLOCKED: 'unlocked',
    ERROR: 'unknown',
    WAITING: 'loader'
};
var API_URL = "PUT_YOUR_API_URL";

HomeAlarmSystem = function() {};

HomeAlarmSystem.prototype.init = function() {
    this.url = API_URL;
    this.armed = false;
    this.loading = true;
    this.error = false;

    this.refresh();
};

HomeAlarmSystem.prototype.refresh = function() {
    var me = this;
    this.loading = true;

    this.displayState();
    $.get( this.url, function( data ) {
        var payload = JSON.parse(data.payload);
        me.loading = false;
        me.error = false;
        me.armed = payload.state.reported.armed === 'yes';

        me.displayState();
    }).fail(function() {
        me.error = true;

        me.displayState();
    });
};

HomeAlarmSystem.prototype.dispatch = function() {
    var me = this;
    this.loading = true;

    this.displayState();
    $.ajax({
        url: this.url,
        type: 'PUT',
        data: JSON.stringify({
            armed: this.armed ? "no" : "yes"
        }),
        success: function(data) {
            me.refresh();
        }
    }).fail(function() {
        me.error = true;

        me.displayState();
    });

};

HomeAlarmSystem.prototype.displayState = function() {
    $("#state").removeClass();

    if (this.error) {
        $("#state").addClass(STATUS.ERROR);
        return ;
    }

    if (this.loading) {
        $("#state").addClass(STATUS.WAITING);
        return ;
    }

    if (this.armed) {
        $("#state").addClass(STATUS.LOCKED);
    } else {
        $("#state").addClass(STATUS.UNLOCKED);
    }

    return ;
};