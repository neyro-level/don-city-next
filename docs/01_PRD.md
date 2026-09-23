# Product Requirements Document

Status: Draft
Version: 0.1
Updated: 2026-09-23

## 1. Product Summary

Публичный сайт и каталог «ДОН СИТИ» для продажи вторичной недвижимости в Донецке и фактически присутствующих nearby geographies.

## 2. Business Goal

- Публиковать актуальный inventory агентства.
- Получать заявки на покупку, продажу и юридическое сопровождение.
- Создать устойчивую SEO-структуру без дублирующих landing pages.

## 3. Users

- Покупатель квартиры, дома или участка.
- Продавец недвижимости.
- Клиент юридического сопровождения.
- Owner/editor в Payload Admin.

## 4. Core Use Cases

- Найти объект по категории, географии, району или утверждённому фасету.
- Открыть карточку и оставить contextual lead.
- Отправить заявку на продажу или юридическую консультацию.
- Импортировать inventory без дублей и опасной массовой деактивации.

## 5. Release 1 Scope

`secondary + sale + apartment|house|land`, Donetsk `SINGLE_GEO`, районы/Текстильщик, seller/lawyer/company/contacts/legal, leads, feeds, SEO/runtime/release readiness.

## 6. Out of Scope R1

Newbuild/ЖК, mortgage, commercial, rent, rooms, garages, journal, employees и дочерние lawyer routes. Их research-first scope находится в EPIC-50…52 или future section master plan.

## 7. Success Criteria

- R1 routes и lifecycle отвечают HTTP/SEO contracts master plan.
- Published data проходит Content Gate; unknown geo/district не искажается.
- Leads фиксируются до delivery и не теряются при временном отказе integration.
- P0/P1 security/architecture findings = 0 перед release candidate.
- Production имеет rollback, backup, staging и external uptime proof.

## 8. Key Risks

- Для одного существующего Don City server в Timeweb пока не подтверждён dedicated Secret Master access contour и database identity.
- Domain/HTTP отвечает нестабильно; фактические server services, database placement и backup posture требуют read-only discovery.
- 53 epics требуют строгого dependency graph и независимых safe waves.

## 9. Open Questions

Нет открытых product/delivery решений, обязательных до финального аудита. `MERGE_AFTER_GATE` утверждён для implementation scope; production остаётся отдельной командой.
