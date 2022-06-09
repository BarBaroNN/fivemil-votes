local QBCore = exports['qb-core']:GetCoreObject()

function Notification(src, message, type)
    --[[
        Replace with your notification trigger,
        Example: QBCore default notification
    ]]

    TriggerClientEvent('QBCore:Notify', src, message, type)
end

function Prize(src)
    --[[
        Give prize after claim function,
        You can change here whatever you wanna give.
        Example is in QBCore but can be changed to every framework.
    ]]

    local prizes = {
        cash = 2500,
        water = 5,
    }
    local player = QBCore.Functions.GetPlayer(src)

    if player then
        for prize, amount in pairs(prizes) do
            if prize == "cash" then 
                player.Functions.AddMoney('cash', amount, 'fivemil_claim') 
            else
                player.Functions.AddItem(prize, amount)
            end
        end

        return true
    end
    return false
end