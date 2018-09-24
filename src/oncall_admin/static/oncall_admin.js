function get_users(startat, startswith, callback) {
  var getload = {};
  if (startat) {
    getload.startat = startat;
  }
  if (startswith) {
    getload.startswith = startswith;
  }
  $.get('/api/users', getload, callback);
}

function get_user(username, callback) {
  $.get('/api/users/' + username, callback);
}

function edit_user(username, info, callback) {
  $.ajax({
        url: '/api/users/' + username,
        data: JSON.stringify(info),
        method: 'PUT',
        contentType: 'application/json'
  }).done(callback);
}

function delete_user(username, callback) {
  $.ajax({
        url: '/api/users/' + username,
        data: '{}',
        method: 'DELETE',
        contentType: 'application/json'
  }).done(callback);
}

function create_user(username, callback) {
  $.ajax({
        url: '/api/users/',
        data: JSON.stringify({username: username}),
        method: 'POST',
        contentType: 'application/json'
  }).done(callback);
}

function init_oncall_admin() {
  Handlebars.registerHelper('booltostr', function(str) {
    return str ? 'Yes' : 'no';
  });

  var user_lister = Handlebars.compile($('#user-lister-template').html()),
      user_viewer = Handlebars.compile($('#user-viewer-template').html()),
      user_editor = Handlebars.compile($('#user-editor-template').html()),
      user_create = Handlebars.compile($('#user-create-template').html()),
      flash_template = Handlebars.compile($('#flash-template').html()),
      user_pagination_interval = 100,
      $content = $('#content'),
      $flashes = $('#flashes'),
      $title = $('h1'),
      router = new Navigo(null, false, '#!'),
      last_flash = null;

  function flash(type, message) {
    last_flash = {type: type, message: message};
  }

  function render_page(title, contents) {
    $title.text(title);
    $content.html(contents);
    router.updatePageLinks();
    if (last_flash) {
      $flashes.html(flash_template(last_flash));
      last_flash = null;
    } else {
      $flashes.empty();
      last_flash = null;
    }
  };

  $content.on('submit', '#user-edit', function(e){
    e.preventDefault();
    var $save_user_button = $('#save-user'),
        username = $save_user_button.data('user');

    $save_user_button.prop('disabled', 'true');

    var contacts = {};
    $('#user-edit').find('.contacts').each(function() {
      var $this = $(this), mode = $this.data('mode'), val = $(this).val();
      contacts[mode] = val;
    });

    var info = {
      full_name: $('#full_name').val(),
      photo_url: $('#photo_url').val(),
      contacts: contacts,
      admin: $('#admin').prop('checked'),
      active: $('#active').prop('checked')
    };

    edit_user(username, info, function(){
      flash('info', 'Updated ' + username);
      router.navigate('/user/' + username);
    });
  });

  $content.on('submit', '#user-create', function(e){
    e.preventDefault();
    var username = $('#username').val();
    if (username == '') {
      return;
    }
    create_user(username, function() {
      flash('info', 'Created ' + username);
      router.navigate('/user/' + username);
    });
  });

  $content.on('click', '#delete-user', function(e){
    e.preventDefault();
    if (!confirm('Really delete?')) {
      return;
    }
    var username = $(this).data('user');
    delete_user(username, function() {
      flash('info', 'Deleted ' + username);
      router.navigate('/');
    });
  });

  $content.on('submit', '#username-search', function(e){
    e.preventDefault();
    var startswith = $('#username-search-box').val();
    if (startswith == '') {
      router.navigate('/');
    } else {
      router.navigate('/users/startat/0/startswith/' + encodeURIComponent(startswith));
    }
  });

  function users_list_page(params) {
    var startat = params.startat ? params.startat : 0;
    var startswith = params.startswith ? decodeURIComponent(params.startswith) : '';
    get_users(startat, params.startswith ? params.startswith : null, function(data) {
      var next = '/users/startat/' + (parseInt(startat) + user_pagination_interval);
      var prev = '/users/startat/' + (parseInt(startat) - user_pagination_interval);

      if (startat <= user_pagination_interval) {
          prev = '/users/startat/0';
      }

      if (startswith != '') {
          next = next + '/startswith/' + startswith;
          prev = prev + '/startswith/' + startswith;
      }

      render_page('Users List', user_lister({users: data, next: next, prev: prev, startswith: startswith}));
    });
  }

  router.on({
    '/': users_list_page,
    '/users/startat/:startat': users_list_page,
    '/users/startat/:startat/startswith/:startswith': users_list_page,

    '/user/:username': function (params) {
      get_user(params.username, function(data) {
        render_page(params.username, user_viewer({user: params.username, info: data}));
      });
    },

    '/user/:username/edit': function (params) {
      get_user(params.username, function(data) {
        render_page(params.username, user_editor({user: params.username, info: data}));
      });
    },

    '/user_create': function () {
      render_page('Create', user_create());
    },
  }).resolve();
}
