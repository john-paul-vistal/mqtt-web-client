$(document).ready(function () {
    var cntdBroker;

    $('#dftBroker').change(function () {
        let broker = $('#dftBroker').val()
        $('#broker').val(broker);
    })


    $('#connect').click(function () {
        if ($('#broker').val() == '') {
            Swal.fire({
                position: 'top',
                icon: 'error',
                title: 'ERROR',
                text: 'PLEASE CHOOSE OR INPUT A BROKER TO CONNECT!',
                showConfirmButton: false,
                timer: 2000
            })

        } else {
            cntdBroker = $('#broker').val();
            showLoading()
            client = mqtt.connect(cntdBroker);
            client.stream.on('error', (err) => {
                console.log(err);
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'ERROR',
                    text:'Cannot connect to this broker',
                    showConfirmButton: false,
                    timer: 2000
                })
                client.end()
            });
            client.on('connect', function () {

                setTimeout(function () {
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        title: 'CONNECTED',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    $('#indicator').css('background-color', '#09ff00')
                    $('#connectedBroker').text(cntdBroker)
                    $('#alertcntdBroker').css('display', 'block');
                    $('#subscribebtn').removeAttr('disabled');
                    $('#pub').removeAttr('disabled');
                    $('#disconnect').removeAttr('disabled');
                    $('#connect').attr('disabled',true);
                    $('#pubTopic').removeAttr('disabled');
                    $('#subTopic').removeAttr('disabled');
                    $('#payload').removeAttr('disabled');
                    setTimeout(function () {
                        $('#alertcntdBroker').css('display', 'none');
                    }, 3000);
                }, 800);

                $('#subscribebtn').click(function () {
                    let subscribedTopic = $('#subTopic').val();
                    let timestamp = new Date().toLocaleString('en-us', { date: 'long' });
                    if (subscribedTopic != '') {
                        $('#subscribe-topic tbody').prepend('<tr><td>' + subscribedTopic + '</td><td>' + timestamp + '</td></tr>')
                        client.subscribe(subscribedTopic, function (err) {
                            if (err) {
                                console.log(err)
                            }
                        })
                        Swal.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'SUCCESS',
                            text: 'Successfuly subscribed to: ' + subscribedTopic,
                            showConfirmButton: false,
                            timer: 1000
                        })
                    } else {
                        Swal.fire({
                            position: 'top',
                            icon: 'info',
                            title: 'EMPTY',
                            text: 'Please provide a topic before you subscibe',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }
                })
            })

            client.on('message', function (topic, payload) {
                let payloadItem = JSON.parse(payload.toString())
                $('#recievedMsg tbody').prepend('<tr><td>' + topic + '</td><td>' + payloadItem.message + '</td><td>' + payloadItem.timestamp + '</td></tr>')
            })
        }
    })


    $('#disconnect').click(function(){
        console.log(cntdBroker)
        client.end()
        disconnecting()
        setTimeout(function () {
            Swal.fire({
                position: 'top',
                icon: 'info',
                title: 'DISCONNECTED',
                showConfirmButton: false,
                timer: 1000
            })
            $('#indicator').css('background-color', '#ff0015')
            $('#discntdBroker').text(cntdBroker)
            $('#disconnectedBroker').css('display', 'block');
            $('#subscribebtn').attr('disabled',true);
            $('#pub').attr('disabled',true);
            $('#disconnect').attr('disabled',true);
            $('#dftBroker').val('');
            $('#broker').val('')
            $('#connect').attr('disabled',true);
            $('#pubTopic').attr('disabled',true);
            $('#subTopic').attr('disabled',true);
            $('#subTopic').val('');
            $('#payload').attr('disabled',true);
            $('#connect').removeAttr('disabled');
            setTimeout(function () {
                $('#disconnectedBroker').css('display', 'none');
            }, 2000);
        }, 500);
    })

    function showLoading() {
        Swal.fire({
            position: 'top',
            title: 'CONNECTING',
            allowEscapeKey: false,
            allowOutsideClick: false,
            timer: 2000,
            onOpen: () => {
                swal.showLoading();
            }
        })
    };
    function disconnecting() {
        Swal.fire({
            position: 'top',
            title: 'DISCONNECTING',
            allowEscapeKey: false,
            allowOutsideClick: false,
            timer: 2000,
            onOpen: () => {
                swal.showLoading();
            }
        })
    };


    // PUBLISH SECTION
    $('#pub').click(function () {
        let topic = $('#pubTopic').val();
        let message = $('#payload').val();
        if (topic == '') {
            Swal.fire({
                position: 'top',
                icon: 'info',
                title: 'EMPTY',
                text: 'Please provide a topic before you publish',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            let timestamp = new Date().toLocaleString('en-us', { date: 'long' });
            let payload = { 'message': message, 'timestamp': timestamp }
            client.publish(topic, JSON.stringify(payload))
            $('#pubTopic').val('');
            $('#payload').val('');
            $('#published-message tbody').prepend('<tr><td>' + topic + '</td><td>' + message + '</td><td>' + timestamp + '</td></tr>')
        }
    })

});//end code

