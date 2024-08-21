--[[
	If you are gonna improve on this design or use it in general (Please don't it's insecure asf) Give me credits!
	
	My discord: milw0rm.5
	My website: pedophile.cc (I know the domain name is a bit weird it's just a about me site)
]]

local HttpService = game:GetService("HttpService")

game.Players.PlayerAdded:Connect(function(player)
	local Username = player.Name
	local requestUrl = "http://localhost:3000/whitelist-check" .. "?Username=" .. HttpService:UrlEncode(Username)
	print("Sending request to backend:", requestUrl)

	local succ, resp = pcall(function()
		return HttpService:GetAsync(requestUrl)
	end)

	if succ then
		local respData = HttpService:JSONDecode(resp)
		if respData.iswld then
			print(player.Name .. " is whitelisted!")
		else
			player:Kick(player.Name .. " is not whitelisted.")
		end
	else
		print("Failed to contact backend:", resp)
	end
end)
