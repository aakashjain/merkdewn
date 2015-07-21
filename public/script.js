marked.setOptions({
	breaks: true,
	sanitize: true
});

window.onload = function() {
	var pad = document.getElementById('pad');
	var preview = document.getElementById('preview');
	var path = document.location.pathname;

	pad.addEventListener('keydown', function(e) {
		if(e.keyCode == 9) {
			var start = this.selectionStart;
			var end = this.selectionEnd;
			var oldVal = e.target.value;
			e.target.value = oldVal.substring(0, start) + '\t' + oldVal.substring(end);
			this.selectionStart = this.selectionEnd = start+1;
			e.preventDefault();
		}
	});

	var makeHtml = function() {
		preview.innerHTML = marked(pad.value);
	}

	pad.addEventListener('input', makeHtml);

	if(path.length == 1) {
		makeHtml();
	} else {
		sharejs.open(path.substring(1), 'text', function(err, doc) {
			if(err) {
				console.log("ShareJS error: ", err);
				return;
			}
			doc.attach_textarea(pad);
			doc.on('remoteop', function(op) {
				makeHtml();
			});
			makeHtml();
		});
	}
}