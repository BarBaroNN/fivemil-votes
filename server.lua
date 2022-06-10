FIVEMIL_CHANNEL = "" -- CHANGE THIS TO YOUR FIVEM ISRAEL CHANNEL

RegisterCommand("vote", function(source, args)
    local src = source
    local discordId = GetDiscordId(src)

    if not discordId then return Notification(src, "Your Discord must be open", "error") end
    
    PerformHttpRequest("http://fivem-israel.digital:8080/api/votes/get", function(err, text, headers)
        TriggerClientEvent('fivemil-votes:create', src, text)
    end, 'POST', json.encode({
        channel = FIVEMIL_CHANNEL,
        discord = discordId
    }), { ['Content-Type'] = 'application/json' })
end)

RegisterServerEvent('fivemil-votes:claim', function(data)
    local src = source
    local discordId = GetDiscordId(src)
    
    if not discordId then return Notification(src, "Your Discord must be open", "error") end

    local payload = {
        channel = FIVEMIL_CHANNEL,
        discord = discordId,
        ts = data.ts,
    } if data.code then payload.code = data.code end
    payload = json.encode(payload)

    PerformHttpRequest("http://fivem-israel.digital:8080/api/votes/claim", function(err, text, headers) 
        if text == 'ok' then
            if Prize(src) then
                Notification(src, "Successfully claimed vote", "success")
            else
                Notification(src, "Error occurred while claiming vote", "error")
            end
        end
        TriggerClientEvent('fivemil-votes:get', src, text)
    end, 'POST', payload, { ['Content-Type'] = 'application/json' })
end)

function GetDiscordId(src)
    local identifiers = GetPlayerIdentifiers(src)
    for _, identifier in pairs(identifiers) do
        if string.find(identifier, 'discord') then
            return identifier
        end
    end
    return nil
end