-- Clearly labelled demonstration seed data. Run after database.sql.
insert into locations(id,name,district,region,country_code,latitude,longitude) values
('10000000-0000-0000-0000-000000000001','Beledweyne','Beledweyne','Hiiraan','SO',4.7358,45.2036),
('10000000-0000-0000-0000-000000000002','Jalalaqsi','Jalalaqsi','Hiiraan','SO',3.3766,45.5996),
('10000000-0000-0000-0000-000000000003','Bulo Burte','Bulo Burte','Hiiraan','SO',3.8538,45.5674),
('10000000-0000-0000-0000-000000000004','Mataban','Mataban','Hiiraan','SO',5.1213,45.2307) on conflict(id) do nothing;
insert into alerts(id,location_id,hazard_type,severity,title_en,title_so,message_en,message_so,source_name,source_url,source_timestamp,starts_at,expires_at,published_at) values('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','flood','high','High flood risk — Beledweyne','Khatar fatahaad oo sare — Beledweyne','Heavy rainfall upstream may raise Shabelle River levels within 48–72 hours. Communities near riverbanks should prepare to move early.','Roobab culus oo ka da’aya meelaha sare ayaa kor u qaadi kara heerka Webiga Shabeelle 48–72 saac gudahood. Bulshada webiga u dhow waa inay isu diyaariso inay goor hore guurto.','DigniinAI demonstration based on ICPAC public products','https://www.icpac.net/',now(),now(),now()+interval '3 days',now()) on conflict(id) do nothing;
insert into community_reports(id,alert_id,location_id,category,description,state,created_at) values
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Rising water','Demonstration: water is approaching homes beside the river road.','pending',now()),
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Blocked road','Demonstration: eastern access road is difficult to pass.','pending',now()-interval '1 hour') on conflict(id) do nothing;
