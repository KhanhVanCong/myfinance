$(document).ready(function () {
    $('.sweet-warning').on('click',
        function (e) {
            e.preventDefault();
            const urlToRedirect = e.currentTarget.getAttribute('href');
            swal({
                    title: "Bạn có chắc muốn Xóa không?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                    // Setup can Change position button
                    //buttons: {
                    //    confirm: "Confirm",
                    //    cancel: true,
                    //}

                })
                .then((willDelete) => {
                    if (willDelete) {
                        window.location = urlToRedirect;
                    }
                });
        });
});