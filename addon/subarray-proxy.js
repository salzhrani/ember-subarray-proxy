import Ember from 'ember';
import computed from 'ember-new-computed';

var get = Ember.get;

export default Ember.ArrayProxy.extend({
    _offset : 0,
    _limit: 10,
    length: Ember.computed.reads('_length'),
    offset: computed({
      get(){
        return this._offset;
      },
      set(key, value){
        // offset cannot be < 0
        if (value < 0) {
          this._offset = 0;
          return 0;
        }
        var contentLength = get(this, 'content.length');
        // offset cannot be > the proxied array length
        if (value > contentLength) {
          this._offset = contentLength;
          return contentLength;
        }
        // if the arranged content hasn't been created yet...
        // just set the variables
        if (!this._hasInitialValue) {
          this._offset = value;
          return value;
        }

        // the arranged content is already set
        // do the proper ember array updates and obeserver notification

        if (value > this._offset) {
          this._shiftArranged(0, value - this._offset, 0);
          this._length = get(this, 'arrangedContent.length');
        }
        this._offset = value;
        return value;
      }
    }),
    limit: computed({
      get(){
        return this._limit;
      },
      set(key, value){
        if (!this._hasInitialValue) {
          this._limit = value;
          return value;
        }
        var arrangedContentLength = get(this,'arrangedContent.length');
        var diff = value - this._limit;
        this._limit = value;
        if (diff > 0) {
          this._shiftArranged(arrangedContentLength,0, diff);
        } else if (diff < 0){
          this._shiftArranged(arrangedContentLength - diff, diff, 0);
        }
        return value;
      }
    }),
    arrangedContent: Ember.computed(function(){
      // this is generated once ... the proxy will take care
      // of updating the arrangedContent and notifying observers
      this._hasInitialValue = true;
      if (get(this, 'content')) {
        var arranged = Ember.A(get(this, 'content').slice(this._offset, this._offset + this._limit));
        this._length = get(arranged,'length');
        return arranged;
      } else {
        return Ember.A();
      }
    }),
    contentArrayWillChange(array, start, removed){
      this._shiftArranged(start, removed, 0);
    },
    _shiftArranged(start, removed, added){
      if (start < this._offset + this._limit) {
        var arrangedContent = get(this, 'arrangedContent');
        var arrangedContentLength = get(this, 'arrangedContent.length');
        var contentLength = get(this, 'content.length');
        var arrangedStart = Math.max(start - this._offset, 0);
        var addCount, removeCount, args;
        if (removed) {

          // we don't care if the chaned items are after our subarray
          if (start < this._offset + this._limit) {

            removeCount = Math.min(removed, arrangedContentLength);
            var sliceOffset = start + removed + removeCount;
            addCount = Math.max(0, Math.min(removeCount, contentLength - (this._offset + this._limit)));
            arrangedContent.arrayContentWillChange(arrangedStart, removeCount, addCount);
            // remove some
            arrangedContent.splice(arrangedStart, removeCount);
            // refill the subarray
            if (addCount > 0) {
              args = [arrangedStart + removeCount, 0].concat(get(this, 'content').slice(sliceOffset , sliceOffset + addCount));
              Array.prototype.splice.apply(arrangedContent, args);
            }
            this._length += (addCount - removeCount);
            arrangedContent.arrayContentDidChange(arrangedStart, removeCount, addCount);
          }
        }
        if (added) {
          if (start < this._limit + this._offset) {
            addCount = Math.min(added, this._limit);
            removeCount = Math.max(0, arrangedContentLength + added - this._limit);
            arrangedContent.arrayContentWillChange(arrangedStart, removeCount, addCount);
            if (removeCount > 0) {
              // remove some
              arrangedContent.splice(arrangedStart, removeCount);
            }
            args = [arrangedStart, 0].concat(get(this, 'content').slice(this._offset + arrangedStart , this._offset + arrangedStart + addCount));
            Array.prototype.splice.apply(arrangedContent, args);
            this._length += (addCount - removeCount);
            arrangedContent.arrayContentDidChange(arrangedStart, removeCount, addCount);
          }
        }
      }
    },
    contentArrayDidChange(array, start, removed, added){
      this._shiftArranged(start, 0, added);

    }
});
