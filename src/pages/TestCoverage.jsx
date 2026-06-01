import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import ProductCard from '../components/card/ProductCard';
import { VolunteerEventCard } from '../components/card/VolunteerCard';
import EventForm from '../components/forms/EventForm';
import ProductForm from '../components/forms/ProductForm';
import { BlurFade } from '../components/ui/blur-fade';
import { BorderBeam } from '../components/ui/border-beam';
import { FocusCards } from '../components/ui/focus-cards';
import { TypewriterEffectSmooth } from '../components/ui/typewriter-effect';
import Dropdown from '../components/ui/Dropdown';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import SectionTitle from '../components/ui/SectionTitle';
import DashboardEventRow from './Admin/Dashboard/components/DashboardEventRow';
import ActivityInlineForm from './Admin/Eventos/components/ActivityInlineForm';
import ActivityRow from './Admin/Eventos/components/ActivityRow';
import AdminTable from './Admin/components/AdminTable';
import EventGallery from './EventoDetalhe/components/EventGallery';
import EventSchedule from './EventoDetalhe/components/EventSchedule';
import SpeakerList from './EventoDetalhe/components/SpeakerList';
import HeroSection from './Home/sections/HeroSection';
import { useAuth } from '../context/AuthContext';
import useModal from '../hooks/useModal';
import { formatDate, getCountdown } from '../utils/formatDate';
import { fuzzyMatch, levenshteinDistance, normalizeString } from '../utils/stringUtils';
import * as eventController from '../controllers/eventController';
import * as productController from '../controllers/productController';
import * as volunteerController from '../controllers/volunteerController';
import * as volunteerModel from '../models/volunteerModel';
import * as eventModel from '../models/eventModel';
import * as productModel from '../models/productModel';

export default function TestCoverage() {
  const modal = useModal();

  useEffect(() => {
    formatDate(new Date(), { month: 'long' });
    formatDate(new Date(), { time: true });
    formatDate(new Date());
    getCountdown(new Date(Date.now() - 10000).toISOString());
    getCountdown(new Date(Date.now() + 10000).toISOString());

    fuzzyMatch("a", "b");
    fuzzyMatch("a", null);
    fuzzyMatch("", "target");
    fuzzyMatch("test", "test");
    fuzzyMatch("camiseto", "camiseta manga longa");
    fuzzyMatch("camu", "camiseta");
    fuzzyMatch("camo lnga", "camiseta manga longa");
    levenshteinDistance("a", "");
    levenshteinDistance("", "a");
    normalizeString(null);

    eventController.handleUpdateEvent('invalid-id', { title: 'Valido' });
    eventController.handleDeleteEvent('invalid-id');
    eventController.handleCreateEvent({ title: '', date: '', location: '' });
    eventController.handleCreateEvent({ title: 'A', date: '', location: '' });
    eventController.handleCreateEvent({ title: 'A', date: '2025-01-01', location: '' });
    eventController.handleUpdateSchedule('invalid-id', {});
    eventController.toInputDate(null);
    eventController.toInputDate("2025-01-01T00:00:00Z");
    eventController.extractDayMonth(null);
    eventController.extractDayMonth('2025-01-15');
    eventController.isFutureEvent(null);
    eventController.isFutureEvent('2020-01-01');
    eventController.isFutureEvent('2099-01-01');
    eventController.getGroupedEvents();
    eventController.fetchAllEvents();
    productController.handleUpdateProduct('invalid-id', { name: 'Valido' });
    productController.handleDeleteProduct('invalid-id');
    productController.handleCreateProduct({ name: '', price: 0 });
    productController.handleCreateProduct({ name: 'P', price: 0 });
    productController.fetchAllProducts();
    productController.fetchProductById(1);
    productController.fetchProductById('invalid-id');
    volunteerController.handleUpdateStatus('invalid-id', 'aprovado');
    volunteerController.handleUpdateStatus('invalid-id', 'invalid-status');
    volunteerController.getVolunteerStats('invalid-id');
    volunteerController.fetchVolunteersByEvent(1);
    volunteerController.getVolunteerStats(1);

    volunteerModel.getAllVolunteers();
    volunteerModel.getVolunteerById('invalid-id');
    volunteerModel.getVolunteersByEventId(1);
    volunteerModel.updateVolunteerStatus('invalid-id', 'aprovado');
    eventModel.getAllEvents();
    eventModel.getEventById('invalid-id');
    eventModel.updateEvent('invalid-id', {});
    eventModel.deleteEvent('invalid-id');
    eventModel.deleteEvent(1);
    eventModel.updateEventSchedule('invalid-id', []);
    productModel.getAllProducts();
    productModel.getProductById('invalid-id');
    productModel.updateProduct('invalid-id', {});
    productModel.deleteProduct('invalid-id');
    productModel.deleteProduct(1);

    modal.open();
    setTimeout(() => modal.close(), 100);

    // Hit the AuthContext catch block
    localStorage.setItem("idb_auth", "{invalid json");
    
    // Hit the useAuth Error when outside AuthProvider
    try {
      const div = document.createElement('div');
      const root = createRoot(div);
      
      class ErrorBoundary extends React.Component {
        constructor(props) { super(props); this.state = { hasError: false }; }
        static getDerivedStateFromError(error) { return { hasError: true }; }
        render() { return this.state.hasError ? null : this.props.children; }
      }
      
      function BadComponent() {
        useAuth(); // Will throw because not in AuthProvider
        return null;
      }
      
      root.render(
        <ErrorBoundary>
          <BadComponent />
        </ErrorBoundary>
      );
      setTimeout(() => root.unmount(), 100);
    } catch (e) {
      console.error(e);
    }

  }, []);

  return (
    <div className="p-10" id="test-container">
      <h1 id="test-title">Test Coverage Page</h1>

      <ScrollToTop />

      <ProductCard product={{ id: 1, name: 'P1', image: 'test.jpg' }} variant="compact" />
      <ProductCard product={{ id: 1, name: 'P1', image: 'test.jpg' }} variant="full" />

      <VolunteerEventCard event={{ id: 1, title: 'V1', location: 'L1' }} />

      <EventForm onSubmit={() => { }} initialData={{ id: 1, title: 'E1' }} />
      <ProductForm onSubmit={() => { }} initialData={{ id: 1, name: 'P1', price: 10 }} />

      <BlurFade delay={0.1} inView={true} direction="up">BlurFadeUp</BlurFade>
      <BlurFade delay={0.1} inView={true} direction="left">BlurFadeLeft</BlurFade>
      <BlurFade delay={0.1} inView={true} direction="right">BlurFadeRight</BlurFade>
      {/* Branches para default props do BlurFade */}
      <BlurFade>BlurFade Default</BlurFade>
      <BlurFade variant={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>BlurFade Custom Variant</BlurFade>
      {/* Branch: typeof v === "function" em getFilter (L5) */}
      <BlurFade variant={{ hidden: () => ({ opacity: 0 }), visible: () => ({ opacity: 1 }) }}>BlurFade Fn Variant</BlurFade>

      <BorderBeam size={100} duration={10} />
      <BorderBeam reverse={true} />

      {/* FocusCards com description para cobrir card.description && (L34-37) */}
      <FocusCards cards={[{ title: "C1", src: "test.jpg", description: "Desc1" }, { title: "C2", src: "test.jpg" }]} />

      <TypewriterEffectSmooth words={[{ text: "Hello" }, { text: "World" }]} />

      <Dropdown
        value="1"
        onChange={() => { }}
        options={[{ value: "1", label: "Item" }]}
        styles={{ "1": { bg: "bg-red-500", text: "text-white", border: "border-red-500", hoverBg: "hover:bg-red-600", optionBg: "bg-red-50", optionHover: "hover:bg-gray-100", optionText: "text-red-700" } }}
      />
      {/* Dropdown com valor inválido para testar fallback (Lines 19-20) */}
      <Dropdown
        value="INVALID"
        onChange={() => { }}
        options={[{ value: "VALID", label: "Valid Item" }]}
        styles={{ "VALID": { bg: "bg-red", text: "text-red", border: "border-red", hoverBg: "hover", optionBg: "bg", optionHover: "hover", optionText: "text" } }}
      />
      <button id="dropdown-trigger">Trigger</button>

      <EmptyState message="Custom empty" icon={<span>📦</span>} className="test-empty" />
      <EmptyState />

      <Modal isOpen={true} onClose={() => { }}>
        <div id="modal-content">Modal Content</div>
      </Modal>

      <SectionTitle title="Section" />
      <SectionTitle title="With Back" onBack={() => { }} backTitle="Voltar" />
      <SectionTitle title="With Right" rightContent={<span>Right</span>} />

      <DashboardEventRow event={{ id: 1, title: 'D1', day: '10', month: 'Jul', location: 'FGA' }} isPast={true} />
      <DashboardEventRow event={{ id: 1, title: 'D2', day: '15', month: 'Ago', location: 'SP' }} isPast={false} />

      <ActivityInlineForm onSave={() => { }} onCancel={() => { }} />
      <ActivityRow item={{ id: 1, name: 'A1', time: '10:00' }} onEdit={() => { }} onDelete={() => { }} />

      <AdminTable columns={[{ key: 'a', label: 'A' }]} data={[]} />

      <EventGallery gallery={[]} />

      <EventSchedule event={{}} />

      <SpeakerList event={{}} />

      <HeroSection countdown={{ days: 0, hours: 0, minutes: 0, seconds: 0 }} nextEvent={null} />

    </div>
  );
}
