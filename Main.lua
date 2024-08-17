local HttpService = game:GetService("HttpService")

local url = "http://localhost:3000/whitelist-check"

game.Players.PlayerAdded:Connect(function(player)
	local Username = player.Name

	local data = {
		Username = Username
	}

	-- Convert Lua table to JSON string
	local jsonData = HttpService:JSONEncode(data)

	-- Send POST request to backend
	print("Sending data to backend:", jsonData)

	local succ, resp = pcall(function()
		return HttpService:PostAsync(url, jsonData, Enum.HttpContentType.ApplicationJson)
	end)

	if succ then
		-- Decode the JSON resp from backend
		local respData = HttpService:JSONDecode(resp)

		-- Check if the user is whitelisted
		if respData.message == "user is whitelisted" then
			print(player.Name .. " is whitelisted!")
		else
			player:Kick(player.Name .. " is not whitelisted.")
		end
	else
		print("Failed to contact backend:", resp)
	end
end)
