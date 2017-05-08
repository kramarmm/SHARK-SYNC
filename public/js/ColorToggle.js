function ColorToggle( geo, colorOn, colorOff ) {
    this.geo = geo;
    this.colorOn = colorOn || 0xFFA6B9;
    this.colorOff = colorOff || 0x03FFC3;
}

ColorToggle.prototype.on = function(geo) {
    this.geo.material.color.set( this.colorOn );
}

ColorToggle.prototype.off = function(geo) {
    this.geo.material.color.set( this.colorOff );
}