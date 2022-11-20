![alt text](example.png) 

# Usecase

User can add custom component via decorator.

# How it works
To see its working type something in editor and press the key combination.

`cmd+k` or `ctrl+k`

# Covered cases
- Users can add custom components via selection by using decorators and strategy
- Handle the default commands via RitchUtils
- Prevent dropdown from rendering if we have zero co-ordinate
- Show dropdown when clicking on an entity
- Close the dropdown when the cursor moves out of Entity
- Add some space to allow edit at the end
- Do not show the menu on the selection
- Show dropdown based on show prop
- Show dropdown when lines are empty based on nodes in DOM
- Readjust the cursor position based on the new editor state
- If at the current cursor position there is no entity detected then close the dropdown
- The open dropdown at the current entity
- Insert some empty entities around component
- Replaced inline styles with classes
- Add bootstrap dropdown menu and handle keyboard