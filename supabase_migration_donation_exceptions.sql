-- Create the donation_exceptions table
create table if not exists donation_exceptions (
  email text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  added_by text -- Optional: to track who added this exception
);

-- Enable Row Level Security
alter table donation_exceptions enable row level security;

-- Policy: Allow everyone to read (to check if they are excepted)
create policy "Enable read access for all users"
on donation_exceptions for select
using (true);

-- Policy: Allow only Super Admin to insert
create policy "Enable insert for Super Admin only"
on donation_exceptions for insert
with check (auth.jwt() ->> 'email' = '9m2pju@hamradio.my');

-- Policy: Allow only Super Admin to delete
create policy "Enable delete for Super Admin only"
on donation_exceptions for delete
using (auth.jwt() ->> 'email' = '9m2pju@hamradio.my');
