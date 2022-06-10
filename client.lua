p = nil

RegisterCommand('nui', function()
    SetNuiFocus(true, true)
end)
RegisterNUICallback('nui', function()
    SetNuiFocus(false, false)
end)

RegisterNetEvent('fivemil-votes:create', function(data)
    SetNuiFocus(true, true)
    SendNuiMessage(data)
end)

RegisterNUICallback('claim', function(data, cb)
    TriggerServerEvent('fivemil-votes:claim', data)
    p = promise.new()
    Citizen.Await(p)
    cb(p)
end)

RegisterNetEvent('fivemil-votes:get', function(data)
    p:resolve(data)
end)
